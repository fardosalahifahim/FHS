document.addEventListener('DOMContentLoaded', () => {
  const registrationForm = document.querySelector('form[aria-label="Registration form"]');
  if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = registrationForm.querySelector('input[name="name"]').value.trim();
      const rollnumber = registrationForm.querySelector('input[name="rollnumber"]').value.trim();
      const studentClass = registrationForm.querySelector('input[name="class"]').value.trim();
      const section = registrationForm.querySelector('select[name="section"]').value;
      const shift = registrationForm.querySelector('input[name="shift"]').value.trim();
      const phone = registrationForm.querySelector('input[name="phone"]').value.trim();
      const email = registrationForm.querySelector('input[name="email"]').value.trim().toLowerCase();
      const password = registrationForm.querySelector('input[name="password"]').value;
      const confirmPassword = registrationForm.querySelector('input[name="confirm_password"]').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            rollnumber,
            class: studentClass,
            section,
            shift,
            phone,
            email,
            password
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Registration successful! Please check your email to verify your account.');
          window.location.href = 'login.html';
        } else {
          alert(data.message || 'Registration failed.');
        }
      } catch (error) {
        alert('Error connecting to server. Please try again later.');
      }
    });
  }
});
