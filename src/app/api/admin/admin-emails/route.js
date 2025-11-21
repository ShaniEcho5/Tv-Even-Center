import { supabase } from '@/lib/supabase'

export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('admin_emails')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching admin emails:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true, emails: data || [] })
  } catch (error) {
    console.error('Error in admin emails GET:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { email, name } = await request.json()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('admin_emails')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return Response.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Insert new admin email
    const { data, error } = await supabase
      .from('admin_emails')
      .insert([{ 
        email: email.toLowerCase().trim(),
        name: name?.trim() || email.split('@')[0],
        is_active: true
      }])
      .select()

    if (error) {
      console.error('Error adding admin email:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ 
      success: true, 
      message: 'Admin email added successfully',
      email: data[0] 
    })
  } catch (error) {
    console.error('Error in admin emails POST:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { id, email, name, is_active } = await request.json()

    if (!id) {
      return Response.json({ error: 'Email ID is required' }, { status: 400 })
    }

    const updateData = {}
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return Response.json({ error: 'Invalid email format' }, { status: 400 })
      }
      updateData.email = email.toLowerCase().trim()
    }
    if (name !== undefined) updateData.name = name.trim()
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabase
      .from('admin_emails')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating admin email:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ 
      success: true, 
      message: 'Admin email updated successfully',
      email: data[0] 
    })
  } catch (error) {
    console.error('Error in admin emails PUT:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return Response.json({ error: 'Email ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('admin_emails')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting admin email:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ 
      success: true, 
      message: 'Admin email deleted successfully' 
    })
  } catch (error) {
    console.error('Error in admin emails DELETE:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}