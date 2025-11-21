import nodemailer from 'nodemailer';

// Admin email addresses
const ADMIN_EMAILS = [

  'sony@echo5digital.com'
];

// Create transporter using your SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports like 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates if needed
    }
  });
};

// Function to send admin notification email
export async function sendAdminNotification(formData) {
  try {
    console.log('🚀 Starting email notification process...');
    console.log('📧 Admin emails:', ADMIN_EMAILS);
    console.log('⚙️ Email config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD
    });
    
    const transporter = createTransporter();

    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
          New Contact Form Submission - TV Event Center
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #4f46e5; margin-top: 0;">Customer Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 8px 0;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;">${formData.email}</td>
            </tr>
            ${formData.phone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${formData.phone}</td>
            </tr>
            ` : ''}
            ${formData.eventType ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Event Type:</td>
              <td style="padding: 8px 0;">${formData.eventType}</td>
            </tr>
            ` : ''}
            ${formData.eventDate ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Event Date:</td>
              <td style="padding: 8px 0;">${new Date(formData.eventDate).toLocaleDateString()}</td>
            </tr>
            ` : ''}
            ${formData.guestCount ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Guest Count:</td>
              <td style="padding: 8px 0;">${formData.guestCount}</td>
            </tr>
            ` : ''}
            ${formData.budgetRange ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Budget Range:</td>
              <td style="padding: 8px 0;">${formData.budgetRange}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #4f46e5; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; color: #4a5568;">${formData.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background-color: #eef2ff; border-radius: 8px;">
          <p style="margin: 0; color: #4f46e5; font-size: 14px;">
            <strong>Action Required:</strong> Please respond to this inquiry within 24 hours for best customer service.
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 12px;">
          <p>This email was automatically generated from the TV Event Center contact form.</p>
          <p>Submission Time: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // Plain text version
    const textContent = `
New Contact Form Submission - TV Event Center

Customer Information:
Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.eventType ? `Event Type: ${formData.eventType}` : ''}
${formData.eventDate ? `Event Date: ${new Date(formData.eventDate).toLocaleDateString()}` : ''}
${formData.guestCount ? `Guest Count: ${formData.guestCount}` : ''}
${formData.budgetRange ? `Budget Range: ${formData.budgetRange}` : ''}

Message:
${formData.message}

Please respond to this inquiry within 24 hours for best customer service.

Submission Time: ${new Date().toLocaleString()}
    `;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ADMIN_EMAILS.join(','),
      subject: `New Contact Form Submission - ${formData.name}`,
      text: textContent,
      html: htmlContent,
      replyTo: formData.email // Allow direct reply to customer
    };

    // Send email
    console.log('📤 Sending email to:', mailOptions.to);
    console.log('📧 Email subject:', mailOptions.subject);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📨 Sent to:', ADMIN_EMAILS);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error);
    console.error('🔧 Email config check:', {
      hasUser: !!process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD,
      hasHost: !!process.env.SMTP_HOST,
      hasPort: !!process.env.SMTP_PORT
    });
    return { success: false, error: error.message };
  }
}

// Function to send confirmation email to customer (optional)
export async function sendCustomerConfirmation(formData) {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5; text-align: center;">Thank You for Your Inquiry!</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Dear ${formData.name},</p>
          
          <p>Thank you for contacting TV Event Center. We have received your inquiry and will get back to you within 24 hours.</p>
          
          <h3 style="color: #4f46e5;">Your Submission Details:</h3>
          <ul style="line-height: 1.8;">
            <li><strong>Event Type:</strong> ${formData.eventType || 'Not specified'}</li>
            ${formData.eventDate ? `<li><strong>Event Date:</strong> ${new Date(formData.eventDate).toLocaleDateString()}</li>` : ''}
            ${formData.guestCount ? `<li><strong>Guest Count:</strong> ${formData.guestCount}</li>` : ''}
            ${formData.budgetRange ? `<li><strong>Budget Range:</strong> ${formData.budgetRange}</li>` : ''}
          </ul>
        </div>

        <div style="background-color: #eef2ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #4f46e5;">
            <strong>What's Next?</strong><br>
            Our team will review your requirements and contact you soon to discuss your event details and provide a personalized quote.
          </p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #718096;">
            Best regards,<br>
            <strong>TV Event Center Team</strong>
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: formData.email,
      subject: 'Thank you for your inquiry - TV Event Center',
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Customer confirmation email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    return { success: false, error: error.message };
  }
}