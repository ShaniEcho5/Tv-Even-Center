import { submitContactForm } from '@/lib/supabase'
import { sendAdminNotification, sendCustomerConfirmation } from '@/lib/emailUtils'

export async function POST(request) {
  try {
    const formData = await request.json()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return Response.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Submit to Supabase
    const result = await submitContactForm(formData)
    
    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Send email notifications (don't fail the request if emails fail)
    try {
      // Send notification to admins
      const adminEmailResult = await sendAdminNotification(formData)
      if (adminEmailResult.success) {
        console.log('Admin notification email sent successfully')
      } else {
        console.error('Failed to send admin notification email:', adminEmailResult.error)
      }

      // Optionally send confirmation to customer
      const customerEmailResult = await sendCustomerConfirmation(formData)
      if (customerEmailResult.success) {
        console.log('Customer confirmation email sent successfully')
      } else {
        console.error('Failed to send customer confirmation email:', customerEmailResult.error)
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError)
      // Continue with success response even if emails fail
    }

    return Response.json(
      { 
        message: 'Form submitted successfully',
        submissionId: result.data[0]?.id
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}