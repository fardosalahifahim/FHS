/**
 * SMTPJS OTP Sender
 * This script generates a 6-digit OTP, sends it via SMTPJS, and stores the OTP and email in localStorage.
 * Replace the SMTP credentials with your own.
 */

const SMTPJS = window.Email || {};

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email) {
  const otp = generateOTP();
  localStorage.setItem('otp', otp);
  localStorage.setItem('unverifiedEmail', email);

  const emailBody = `
    <h3>Your OTP for email verification</h3>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>Please enter this code on the verification page to verify your email.</p>
  `;

  try {
    await SMTPJS.send({
      SecureToken: 'AF05CE5A0345CD2C3A8EDB5D851CF78172130D0F0BBD6BAAF88629ECD38DF23395C083B0A2E8EA4824CE075D12EBAE9A', // Replace with your SMTPJS secure token
      To: email,
      From: 'mail.fhs.sup@gmail.com', // Replace with your sender email
      Subject: 'Email Verification OTP',
      Body: emailBody,
    });
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    return { success: false, message: error.message || 'Failed to send OTP' };
  }
}

function verifyOtp(inputOtp) {
  const storedOtp = localStorage.getItem('otp');
  return inputOtp === storedOtp;
}

export { sendOtpEmail, verifyOtp };
