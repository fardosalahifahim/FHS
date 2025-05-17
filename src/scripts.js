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
});
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
  });
}