import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// GET - Fetch all occupied dates
export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ 
        error: 'Supabase configuration missing',
        details: 'Please check your environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY'
      }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('occupied_dates')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      
      // Check if the error is due to table not existing
      if (error.code === 'PGRST116' || error.message?.includes('relation "occupied_dates" does not exist')) {
        return NextResponse.json({ 
          error: 'Database table not found. Please run the SQL setup script in Supabase.',
          details: 'Table "occupied_dates" does not exist. Check CALENDAR-README.md for setup instructions.',
          setupRequired: true
        }, { status: 404 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to fetch occupied dates',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ dates: data || [] }, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}

// POST - Add occupied date
export async function POST(request) {
  try {
    const { date, slot } = await request.json()

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const validSlots = ['daytime', 'evening']
    const slotName = slot && validSlots.includes(slot) ? slot : null

    // Build the payload: set the requested slot to true, keep other as-is
    const upsertPayload = { date, daytime: slotName === 'daytime' || slotName === null, evening: slotName === 'evening' || slotName === null }

    // Use upsert: if row exists for this date, it will update; otherwise insert
    const { data, error } = await supabase
      .from('occupied_dates')
      .upsert([upsertPayload], { onConflict: 'date' })
      .select()
      .single()

    if (error) {
      console.error('Supabase upsert error:', JSON.stringify(error, null, 2))
      return NextResponse.json({ error: 'Failed to update occupied date', details: error.message, code: error.code }, { status: 500 })
    }

    // Check if now both slots are occupied
    if (data.daytime && data.evening) {
      return NextResponse.json({ message: 'Date fully occupied', data }, { status: 200 })
    }

    return NextResponse.json({ message: 'Slot marked as occupied', data }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove occupied date or free a specific slot
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const slot = searchParams.get('slot')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    const validSlots = ['daytime', 'evening']
    const slotName = slot && validSlots.includes(slot) ? slot : null

    if (!slotName) {
      // If no slot provided, remove whole row
      const { error } = await supabase
        .from('occupied_dates')
        .delete()
        .eq('date', date)

      if (error) {
        console.error('Supabase delete error:', error)
        return NextResponse.json({ error: 'Failed to remove occupied date' }, { status: 500 })
      }

      return NextResponse.json({ message: 'Occupied date removed successfully' }, { status: 200 })
    }

    // Otherwise clear the specified slot
    const updates = {}
    updates[slotName] = false

    const { data: updatedRow, error: updateErr } = await supabase
      .from('occupied_dates')
      .update(updates)
      .eq('date', date)
      .select()
      .maybeSingle()

    if (updateErr) {
      console.error('Supabase DELETE update error:', JSON.stringify(updateErr, null, 2))
      return NextResponse.json({ error: 'Failed to update occupied date', details: updateErr.message, code: updateErr.code }, { status: 500 })
    }

    // If both slots now false, delete the row to keep table tidy
    if (updatedRow && !updatedRow.daytime && !updatedRow.evening) {
      const { error: delErr } = await supabase
        .from('occupied_dates')
        .delete()
        .eq('date', date)

      if (delErr) console.warn('Failed to delete empty occupied_dates row:', delErr)
    }

    return NextResponse.json({ message: 'Slot freed', data: updatedRow || null }, { status: 200 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}