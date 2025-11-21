import { sendAdminNotification } from '@/lib/emailUtils';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    console.log('🔧 Testing email configuration...');
    
    // First test SMTP connection
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('🔌 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    // Test email data
    const testFormData = {
      name: 'Test Customer - ' + new Date().toLocaleTimeString(),
      email: 'test@example.com',
      phone: '555-123-4567',
      eventType: 'Wedding',
      eventDate: '2024-12-25',
      guestCount: '100',
      budgetRange: '$5000-$10000',
      message: 'This is a test email notification to verify the email system is working correctly. Sent at: ' + new Date().toLocaleString()
    };

    console.log('📧 Sending test email notification...');
    const result = await sendAdminNotification(testFormData);

    if (result.success) {
      return Response.json({
        success: true,
        message: 'Test email sent successfully to sony@echo5digital.com and shani@echo5digital.com!',
        messageId: result.messageId,
        details: 'Check your email inboxes (including spam folder)'
      });
    } else {
      return Response.json({
        success: false,
        error: result.error,
        details: 'Check console logs for detailed error information'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Test email error:', error);
    return Response.json({
      success: false,
      error: error.message,
      details: 'SMTP connection or authentication failed'
    }, { status: 500 });
  }
}