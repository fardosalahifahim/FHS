document.addEventListener('DOMContentLoaded', () => {
  // Extracurricular activities slider
  const extracurricularContent = document.querySelector('.extracurricular-content');
  if (extracurricularContent) {
    const prevButton = document.querySelector('.extracurricular-slider-button.prev');
    const nextButton = document.querySelector('.extracurricular-slider-button.next');
    if (prevButton && nextButton) {
      const scrollAmount = extracurricularContent.querySelector('.activity').offsetWidth + 16; // 16px gap approx
      prevButton.addEventListener('click', () => {
        extracurricularContent.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
      nextButton.addEventListener('click', () => {
        extracurricularContent.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }
  }

  // Gallery slider
  const galleryContent = document.querySelector('.gallery-content');
  const galleryPrevButton = document.querySelector('.gallery-slider-button.prev');
  const galleryNextButton = document.querySelector('.gallery-slider-button.next');

  if (galleryContent && galleryPrevButton && galleryNextButton) {
    const galleryItem = galleryContent.querySelector('figure');
    const gap = parseInt(window.getComputedStyle(galleryContent).gap) || 24; // fallback gap

    const scrollAmount = galleryItem ? galleryItem.offsetWidth + gap : 320;

    galleryPrevButton.addEventListener('click', () => {
      galleryContent.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    galleryNextButton.addEventListener('click', () => {
      galleryContent.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // Navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // More menu toggle
  const moreButton = document.querySelector('.more-button');
  const moreDropdownMenu = document.querySelector('.more-dropdown-menu');

  if (moreButton && moreDropdownMenu) {
    moreButton.addEventListener('click', () => {
      moreDropdownMenu.classList.toggle('show');
      const expanded = moreButton.getAttribute('aria-expanded') === 'true';
      moreButton.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Authentication logic - Registration form handler
  const registrationForm = document.querySelector('form[aria-label="Registration form"]');

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

  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = registrationForm.querySelector('input[name="name"]').value.trim();
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

      // Generate verification code
      const verificationCode = generateVerificationCode();

      // Send verification code via FormSubmit
      // Create a temporary form to send email
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
            // Save user
            users.push({ name, email, password });
            saveUsers(users);
            alert('Registration successful! You can now log in.');
            window.location.href = 'login.html';
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
