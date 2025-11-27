import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  // Don't throw error during build, handle gracefully
  if (typeof window === 'undefined') {
    console.warn('Supabase client initialization skipped during build')
  }
}

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Helper function to submit contact form
export async function submitContactForm(formData) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          event_type: formData.eventType,
          event_date: formData.eventDate,
          guest_count: parseInt(formData.guestCount) || null,
          budget_range: formData.budgetRange,
          message: formData.message,
          status: 'new'
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error submitting form:', error)
    return { success: false, error: error.message }
  }
}

// Helper function to get all submissions (for admin)
export async function getContactSubmissions(filters = {}) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    let query = supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters if provided
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    
    if (filters.startDate) {
      // Convert date to start of day in UTC
      const startDate = new Date(filters.startDate + 'T00:00:00')
      query = query.gte('created_at', startDate.toISOString())
    }
    
    if (filters.endDate) {
      // Convert date to end of day in UTC
      const endDate = new Date(filters.endDate + 'T23:59:59.999')
      query = query.lte('created_at', endDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return { success: false, error: error.message }
  }
}

// Helper function to update submission status
export async function updateSubmissionStatus(id, status) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error updating status:', error)
    return { success: false, error: error.message }
  }
}

// Helper function to get submission statistics
export async function getSubmissionStats() {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('status, created_at')

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Calculate statistics
    const total = data.length
    const newSubmissions = data.filter(item => item.status === 'new').length
    const contacted = data.filter(item => item.status === 'contacted').length
    const converted = data.filter(item => item.status === 'converted').length

    // Get submissions from last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentSubmissions = data.filter(
      item => new Date(item.created_at) >= thirtyDaysAgo
    ).length

    return {
      success: true,
      stats: {
        total,
        new: newSubmissions,
        contacted,
        converted,
        recent: recentSubmissions
      }
    }
  } catch (error) {
    console.error('Error getting stats:', error)
    return { success: false, error: error.message }
  }
}

// Helper function to delete a contact submission
export async function deleteContactSubmission(id) {
  try {
    // Use admin client for delete operations to bypass RLS
    const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!serviceKey) {
      console.warn('No service role key found, using regular client')
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }
    }
    
    const adminSupabase = serviceKey 
      ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey)
      : supabase
    
    if (!adminSupabase) {
      throw new Error('Admin Supabase client not initialized')
    }

    console.log('Attempting to delete submission with ID:', id, typeof id)

    // Try to delete directly without checking first
    const { data, error, count } = await adminSupabase
      .from('contact_submissions')
      .delete()
      .eq('id', id)
      .select()

    console.log('Delete operation result:', { data, error, count, affectedRows: data?.length })

    if (error) {
      console.error('Supabase delete error:', error)
      return { success: false, error: error.message }
    }

    if (!data || data.length === 0) {
      console.log('No rows affected - submission may not exist')
      return { success: false, error: 'Submission not found or already deleted' }
    }

    console.log('Delete successful:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error deleting submission:', error)
    return { success: false, error: error.message }
  }
}

// Helper function to submit a booking (used before payment)
export async function submitBooking(formData) {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          event_type: formData.eventType,
          event_date: formData.event_date || formData.eventDate || formData.event_date,
          guest_count: parseInt(formData.guestCount) || null,
          budget_range: formData.budgetRange,
          message: formData.message,
          status: 'pending_payment',
          time_slot: formData.time_slot || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error (submitBooking):', error)
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error submitting booking:', error)
    return { success: false, error: error.message }
  }
}

// Get bookings (admin)
export async function getBookings(filters = {}) {
  try {
    if (!supabase) throw new Error('Supabase client not initialized')

    let query = supabase.from('bookings').select('*').order('created_at', { ascending: false })

    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status)

    const { data, error } = await query
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return { success: false, error: error.message }
  }
}

// Update booking payment info (used by webhook)
export async function updateBookingPayment(bookingId, updates = {}) {
  try {
    // Use service role key if available
    const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    const adminSupabase = serviceKey ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceKey) : supabase

    if (!adminSupabase) throw new Error('Admin Supabase client not initialized')

    const { data, error } = await adminSupabase
      .from('bookings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating booking payment:', error)
    return { success: false, error: error.message }
  }
}