const nodemailer = require('nodemailer');

async function sendTestEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mail.fhs.sup@gmail.com', // Your email
      pass: 'FHS=pass'                // Your app password
    }
  });

  const mailOptions = {
    from: 'mail.fhs.sup@gmail.com',
    to: 'your-email@example.com', // Change to your test email
    subject: 'Test Email from Nodemailer',
    text: 'This is a test email to verify nodemailer configuration.'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

sendTestEmail();
