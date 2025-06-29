const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from homepage directory
app.use(express.static(__dirname));

const otpStore = new Map(); // Store OTPs temporarily in memory
const users = new Map(); // Store users with email verification status and idNumber

// Configure Nodemailer transporter with Elastic Email SMTP using provided credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 2525,
  auth: {
    user: 'mail.fhs.sup@gmail.com',
    pass: '128338260E4226AD05FD6E289244A268672C38D290D957A4020EAE8F76B2258767A898BBE94B6995F7893A77A75972AA',
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is required');
  }
  const otp = generateOTP();
  otpStore.set(email, otp);

  const mailOptions = {
    from: 'mail.fhs.sup@gmail.com', // Verified sender email
    to: email,
    subject: 'Email Verification OTP',
    html: `
      <h3>Your OTP for email verification</h3>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>Please enter this code on the verification page to verify your email.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
      return res.status(500).send('Failed to send OTP email');
    }
    res.send('OTP sent successfully');
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).send('Email and OTP are required');
  }
  const storedOtp = otpStore.get(email);
  if (storedOtp === otp) {
    otpStore.delete(email);
    // Mark user as verified
    const user = users.get(email) || {};
    user.verified = true;
    users.set(email, user);
    res.send({ message: 'Email verified successfully' });
  } else {
    res.status(400).send({ message: 'Invalid OTP' });
  }
});

app.post('/register', (req, res) => {
  const { idNumber, name, rollnumber, class: studentClass, section, shift, phone, email } = req.body;
  if (!idNumber || !email) {
    return res.status(400).json({ message: 'ID number and email are required' });
  }
  // Check if idNumber already exists
  for (const user of users.values()) {
    if (user.idNumber === idNumber) {
      return res.status(400).json({ message: 'ID number already exists' });
    }
  }
  if (users.has(email)) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }
  users.set(email, { idNumber, name, rollnumber, class: studentClass, section, shift, phone, verified: false });
  res.json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const user = users.get(email);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  if (!user.verified) {
    return res.status(403).json({ message: 'Email not verified' });
  }
  res.json({ user: { email } });
});

// Serve email-verification.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'email-verification.html'));
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
