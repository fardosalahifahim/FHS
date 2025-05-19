document.addEventListener('DOMContentLoaded', () => {
  // Helper functions
  function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  // Login form handler
  const loginForm = document.querySelector('form[aria-label="Login form"]');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[name="email"]').value.trim().toLowerCase();
      const password = loginForm.querySelector('input[name="password"]').value;

      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Login successful!');
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid email or password.');
      }
    });
  }
});
