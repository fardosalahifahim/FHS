document.getElementById('registration-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const rollnumber = document.getElementById('rollnumber').value;
  const studentClass = document.getElementById('class').value;
  const section = document.getElementById('section').value;
  const shift = document.getElementById('shift').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Call backend register endpoint
  const response = await fetch('http://localhost:3001/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rollnumber, class: studentClass, section, shift, phone, email, password })
  });

  const data = await response.json();

  if (response.ok) {
    // Send OTP email using SMTP.js
    const otp = data.otp; // Assuming backend returns OTP (if not, adjust accordingly)
    Email.send({
      SecureToken: "a046a90c-43c3-48fb-9a78-82c4748b41da",
      To: email,
      From: "mail.fhs.sup@gmail.com",
      Subject: "Your Faridpur High School OTP",
      Body: `Here is your OTP: ${otp}`
    }).then(
      message => alert("OTP sent to your email: " + email)
    );

    // Show OTP input UI
    document.getElementById('otp-section').style.display = 'block';
  } else {
    alert(data.message || 'Registration failed');
  }
});

// OTP verification handler
document.getElementById('otp-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const otpInput = document.getElementById('otp-input').value;

  // Call backend OTP verification endpoint
  const response = await fetch('http://localhost:3001/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp: otpInput })
  });

  const data = await response.json();

  if (response.ok) {
    alert('Email verified successfully! You can now log in.');
    // Redirect to login page or dashboard
    window.location.href = 'login.html';
  } else {
    alert(data.message || 'OTP verification failed');
  }
});
