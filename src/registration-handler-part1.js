document.addEventListener('DOMContentLoaded', () => {
  // Helper functions
  function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }
