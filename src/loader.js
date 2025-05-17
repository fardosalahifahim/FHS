document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loading-spinner');
  const mainContent = document.getElementById('main-content');
  loader.style.display = 'flex';
  mainContent.style.display = 'none';
  const minLoadingTime = 500;
  const startTime = Date.now();
  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = minLoadingTime - elapsed;
    setTimeout(() => {
      loader.style.display = 'none';
      mainContent.style.display = 'block';
    }, remaining > 0 ? remaining : 0);
  });
});
