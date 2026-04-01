// ===== PAGE FADE + BLUR TRANSITIONS =====
// Blur lives on .page-content (a wrapper div), NOT on body.
// body filter would break position:fixed for toast, navbar, cart, live chat.

export function initPageTransition() {
  // Fade body in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add('page-ready');
    });
  });

  // Intercept internal link clicks
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('http') ||
      href.startsWith('//') ||
      href.startsWith('#') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      link.target === '_blank' ||
      e.metaKey || e.ctrlKey || e.shiftKey
    ) return;

    e.preventDefault();
    document.body.classList.remove('page-ready');
    document.body.classList.add('page-leaving');
    setTimeout(() => { window.location.href = href; }, 230);
  });
}
