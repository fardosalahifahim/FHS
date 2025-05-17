document.addEventListener('DOMContentLoaded', () => {
  const otpForm = document.getElementById('otp-form');
  const resendBtn = document.getElementById('resend-btn');
  const messageEl = document.getElementById('message');

  // Auto-fill email if stored in localStorage
  const storedEmail = localStorage.getItem('unverifiedEmail');
  if (storedEmail) {
    otpForm.email.value = storedEmail;
  }

  otpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = otpForm.email.value.trim().toLowerCase();
    const otp = otpForm.otp.value.trim();

    try {
      const response = await fetch('http://localhost:3001/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp })
      });
      const data = await response.json();
      if (response.ok) {
        messageEl.style.color = 'green';
        messageEl.textContent = data.message;
        localStorage.removeItem('unverifiedEmail');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        messageEl.style.color = 'red';
        messageEl.textContent = data.message || 'OTP verification failed.';
      }
    } catch (error) {
      messageEl.style.color = 'red';
      messageEl.textContent = 'Error connecting to server. Please try again later.';
    }
  });

  resendBtn.addEventListener('click', async () => {
    const email = otpForm.email.value.trim().toLowerCase();
    if (!email) {
      messageEl.style.color = 'red';
      messageEl.textContent = 'Please enter your email to resend verification.';
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        messageEl.style.color = 'green';
        messageEl.textContent = data.message;
      } else {
        messageEl.style.color = 'red';
        messageEl.textContent = data.message || 'Failed to resend verification email.';
      }
    } catch (error) {
      messageEl.style.color = 'red';
      messageEl.textContent = 'Error connecting to server. Please try again later.';
    }
  });
});
