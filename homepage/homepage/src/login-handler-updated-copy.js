document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form[aria-label="Login form"]');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[name="email"]').value.trim().toLowerCase();
      const password = loginForm.querySelector('input[name="password"]').value;

      try {
        const response = await fetch('http://127.0.0.1:3001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('loggedInUser', JSON.stringify(data.user));
          alert('Login successful!');
          window.location.href = 'dashboard.html';
        } else {
          if (data.message === 'Email not verified') {
            alert('Your email is not verified. You will be redirected to the email verification page.');
            localStorage.setItem('unverifiedEmail', email);
            window.location.href = 'email-verification.html';
          } else {
            alert(data.message || 'Login failed.');
          }
        }
      } catch (error) {
        alert('Error connecting to server. Please try again later.');
      }
    });
  }
});
