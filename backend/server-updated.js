// Import required modules
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const port = 3001;

const fs = require('fs');
const path = require('path');

// Logging middleware for debugging with file logging
app.use((req, res, next) => {
  const logEntry = `${new Date().toISOString()} ${req.method} ${req.url} - Body: ${JSON.stringify(req.body)}\n`;
  fs.appendFile(path.join(__dirname, 'request.log'), logEntry, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
  console.log(logEntry.trim());
  next();
});

// Configure CORS to allow requests from frontend origin
app.use(cors({
  origin: 'http://localhost:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Store users and their OTPs in-memory
const users = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP function
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Endpoint to initiate email verification and registration
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (users[email]) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Generate OTP
  const otp = generateOTP();

  // Store user with password and OTP in-memory
  users[email] = {
    password,
    otp,
    verified: false
  };

  // Email configuration
  const mailOptions = {
    from: 'mail.fhs.sup@gmail.com',
    to: email,
    subject: 'Email Verification OTP',
    text: `Your OTP for email verification is: ${otp}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Failed to send OTP');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'OTP sent successfully' });
  });
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Check if user exists
  if (!users[email]) {
    return res.status(400).send('User not found');
  }

  // Check if OTP is correct
  if (users[email].otp === parseInt(otp)) {
    // Mark user as verified
    users[email].verified = true;
    return res.status(200).send('OTP verified successfully');
  } else {
    return res.status(401).send('Invalid OTP');
  }
});

// Endpoint to handle login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  if (!users[email]) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check if email is verified
  if (!users[email].verified) {
    return res.status(401).json({ message: 'Email not verified' });
  }

  // Check password (for demo, password is stored as plain text in users object)
  if (users[email].password !== password) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Successful login
  return res.status(200).json({ user: { email } });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
