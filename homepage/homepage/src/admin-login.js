function validateLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');

  if (username === 'FaridpurHighSchool' && password === 'FHSfaridpurhighschool') {
    // Set login flag in localStorage
    localStorage.setItem('isAdminLoggedIn', 'true');
    // Redirect to admin panel page on successful login
    window.location.href = 'panel.html';
  } else {
    errorMessage.textContent = 'Invalid username or password. Please try again.';
  }
  return false;
}

document.addEventListener('DOMContentLoaded', function() {
  const passwordInput = document.getElementById('password');

  // Create wrapper div for password input and toggle button
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-block';
  wrapper.style.width = '100%';

  // Style password input to fill wrapper width
  passwordInput.style.paddingRight = '2.5rem';
  passwordInput.style.boxSizing = 'border-box';

  // Insert wrapper before password input and move password input inside wrapper
  passwordInput.parentNode.insertBefore(wrapper, passwordInput);
  wrapper.appendChild(passwordInput);

  // Create toggle button with eye icon
  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.setAttribute('aria-label', 'Toggle password visibility');
  toggleButton.style.position = 'absolute';
  toggleButton.style.top = '50%';
  toggleButton.style.right = '0.5rem';
  toggleButton.style.transform = 'translateY(-50%)';
  toggleButton.style.background = 'none';
  toggleButton.style.border = 'none';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.padding = '0';
  toggleButton.style.margin = '0';
  toggleButton.style.width = '24px';
  toggleButton.style.height = '24px';
  toggleButton.style.display = 'flex';
  toggleButton.style.alignItems = 'center';
  toggleButton.style.justifyContent = 'center';
  toggleButton.style.color = '#2d005a';

  // SVG eye icon for show
  const eyeIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20" height="20"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  // SVG eye-off icon for hide
  const eyeOffIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" width="20" height="20"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.64 21.64 0 0 1 5.06-6.36"/><path d="M1 1l22 22"/></svg>';

  toggleButton.innerHTML = eyeIcon;

  toggleButton.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleButton.innerHTML = eyeOffIcon;
    } else {
      passwordInput.type = 'password';
      toggleButton.innerHTML = eyeIcon;
    }
  });

  wrapper.appendChild(toggleButton);
});
