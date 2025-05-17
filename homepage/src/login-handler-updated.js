document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form[aria-label="Login form"]');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[name="email"]').value.trim().toLowerCase();
      const password = loginForm.querySelector('input[name="password"]').value;

      try {
        const response = await fetch('http://localhost:3001/login', {
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
          alert(data.message || 'Login failed.');
        }
      } catch (error) {
        alert('Error connecting to server. Please try again later.');
      }
    });
  }
});
