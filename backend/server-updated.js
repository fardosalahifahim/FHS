const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, 'users.json');

// Load users from file or initialize empty array
let users = [];
if (fs.existsSync(usersFilePath)) {
  const data = fs.readFileSync(usersFilePath);
  users = JSON.parse(data);
}

// Save users to file
function saveUsers() {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Generate random token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Configure nodemailer transporter (use your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mail.fhs.sup@gmail.com', // User's email
    pass: 'FHS=pass'                // User's app password
  }
});

// Register endpoint
app.post('/register', (req, res) => {
  const { name, rollnumber, class: studentClass, section, shift, phone, email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  if (users.find(u => u.rollnumber === rollnumber)) {
    return res.status(400).json({ message: 'Roll number already registered' });
  }

  const verificationToken = generateToken();

  const newUser = {
    id: crypto.randomUUID(),
    name,
    rollnumber,
    class: studentClass,
    section,
    shift,
    phone,
    email,
    password,
    verified: false,
    verificationToken
  };

  users.push(newUser);
  saveUsers();

  // Send verification email
  const verificationUrl = `http://localhost:${PORT}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: 'mail.fhs.sup@gmail.com', // User's email
    to: email,
    subject: 'Verify your email for Faridpur High School',
    html: `<p>Hello ${name},</p>
           <p>Please verify your email by clicking the link below:</p>
           <a href="${verificationUrl}">${verificationUrl}</a>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send verification email', error: error.message });
    }
    res.json({ message: 'Registration successful, verification email sent' });
  });
});

// Email verification endpoint
app.get('/verify-email', (req, res) => {
  const { token } = req.query;
  const user = users.find(u => u.verificationToken === token);
  if (!user) {
    return res.status(400).send('Invalid or expired verification token');
  }
  user.verified = true;
  user.verificationToken = null;
  saveUsers();
  res.send('Email verified successfully! You can now log in.');
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }
  if (!user.verified) {
    return res.status(403).json({ message: 'Email not verified' });
  }
  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
