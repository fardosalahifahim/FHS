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

      // Send verification code via FormSubmit
      const formSubmitUrl = 'https://formsubmit.co/ajax/your-email@example.com'; // Replace with your email

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', 'Email Verification Code');
      formData.append('message', `Your verification code is: ${verificationCode}`);

      fetch(formSubmitUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.success === 'true' || data.success === true) {
          // Prompt user to enter verification code
          const userCode = prompt('A verification code has been sent to your email. Please enter it here:');
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
        } else {
          alert('Failed to send verification email. Please try again later.');
        }
      })
      .catch(() => {
        alert('Failed to send verification email. Please try again later.');
      });
    });
  }
});
