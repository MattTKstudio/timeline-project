// scripts/lazyload.js

window.addEventListener('DOMContentLoaded', () => {
  const lazyImages = [].slice.call(document.querySelectorAll('img[data-src]'));

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for old browsers
    const loadImages = () => {
      lazyImages.forEach(img => {
        if (img.getBoundingClientRect().top < window.innerHeight && img.getBoundingClientRect().bottom > 0) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
    };
    loadImages();
    window.addEventListener('scroll', loadImages);
    window.addEventListener('resize', loadImages);
    window.addEventListener('orientationchange', loadImages);
  }
});
