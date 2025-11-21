import { sendAdminNotification } from '@/lib/emailUtils';

export async function POST(request) {
  try {
    // Test email data
    const testFormData = {
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '555-123-4567',
      eventType: 'Wedding',
      eventDate: '2024-12-25',
      guestCount: '100',
      budgetRange: '$5000-$10000',
      message: 'This is a test email notification to verify the email system is working correctly.'
    };

    console.log('Testing email notification...');
    const result = await sendAdminNotification(testFormData);

    if (result.success) {
      return Response.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId
      });
    } else {
      return Response.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test email error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}