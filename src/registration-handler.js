document.addEventListener('DOMContentLoaded', () => {
  // Helper functions
  function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }

  // Registration form handler
  const registrationForm = document.querySelector('form[aria-label="Registration form"]');
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
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

      let users = getUsers();
      if (users.find(user => user.email === email)) {
        alert('Email is already registered.');
        return;
      }
      if (users.find(user => user.rollnumber === rollnumber)) {
        alert('Roll number is already registered.');
        return;
      }

      // Generate verification code
      const verificationCode = generateVerificationCode();

      // Show OTP to user for demo/testing (in real app, send via email)
      alert(`Your verification code is: ${verificationCode}`);

      // Prompt user to enter verification code
      const userCode = prompt('Please enter the verification code sent to your email:');
      if (userCode === verificationCode) {
        // Save user and auto-login
        const newUser = { name, rollnumber, class: studentClass, section, shift, phone, email, password };
        users.push(newUser);
        saveUsers(users);
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));
        alert('Registration successful! You are now logged in.');
        window.location.href = 'dashboard.html';
      } else {
        alert('Incorrect verification code.');
      }
    });
  }
});
