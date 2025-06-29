const nodemailer = require('nodemailer');

async function testSmtpConnection() {
  let transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    auth: {
      user: 'mail.fhs.sup@gmail.com',
      pass: '128338260E4226AD05FD6E289244A268672C38D290D957A4020EAE8F76B2258767A898BBE94B6995F7893A77A75972AA',
    },
  });

  try {
    await transporter.verify();
    console.log('SMTP connection successful');
  } catch (error) {
    console.error('SMTP connection failed:', error);
  }
}

testSmtpConnection();
