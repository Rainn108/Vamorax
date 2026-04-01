// ===== ANIMATED PILL NAVBAR =====
// Pill animates via `left` and `width` on the .nav-pill element.
// Rubber-band: on move, the pill stretches (width grows toward target)
// then the trailing edge catches up — like a rubber band snapping.

export function initNavPill() {
  const nav = document.querySelector('.navbar-nav');
  if (!nav) return;

  // Inject pill
  const pill = document.createElement('div');
  pill.className = 'nav-pill';
  nav.appendChild(pill);

  const links = Array.from(nav.querySelectorAll('a'));
  let activeLink = nav.querySelector('a.active') || links[0];

  // Pill state — tracks leading and trailing edges independently
  let leadX = 0;   // right edge (px from nav left)
  let trailX = 0;  // left edge (px from nav left)
  let raf = null;

  // Get element bounds relative to nav
  function bounds(el) {
    const navRect = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { left: r.left - navRect.left, right: r.right - navRect.left, width: r.width };
  }

  // Apply current lead/trail to pill
  function applyPill() {
    const left = Math.min(leadX, trailX);
    const right = Math.max(leadX, trailX);
    pill.style.left = left + 'px';
    pill.style.width = (right - left) + 'px';
    pill.style.top = '50%';
    pill.style.transform = 'translateY(-50%)';
  }

  // Snap pill instantly to an element (no animation)
  function snapTo(el) {
    const b = bounds(el);
    leadX = b.right;
    trailX = b.left;
    applyPill();
  }

  // Animate pill to a target element with rubber-band stretch
  // leadSpeed: how fast the leading edge moves (0–1 per frame lerp factor)
  // trailSpeed: how fast the trailing edge follows
  function animateTo(el, leadSpeed = 0.22, trailSpeed = 0.12) {
    const b = bounds(el);
    const targetLead = b.right;
    const targetTrail = b.left;

    if (raf) cancelAnimationFrame(raf);

    function frame() {
      // Leading edge moves faster — creates the stretch
      leadX += (targetLead - leadX) * leadSpeed;
      // Trailing edge follows slower — rubber-band lag
      trailX += (targetTrail - trailX) * trailSpeed;

      applyPill();

      // Stop when both edges are close enough
      const done =
        Math.abs(leadX - targetLead) < 0.3 &&
        Math.abs(trailX - targetTrail) < 0.3;

      if (!done) {
        raf = requestAnimationFrame(frame);
      } else {
        leadX = targetLead;
        trailX = targetTrail;
        applyPill();
        raf = null;
      }
    }

    raf = requestAnimationFrame(frame);
  }

  // Wait one frame for layout to settle, then place pill
  requestAnimationFrame(() => {
    if (activeLink) snapTo(activeLink);
  });

  // Hover: animate pill to hovered link
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      animateTo(link, 0.22, 0.10);
    });
    link.addEventListener('mouseleave', () => {
      // Return to active link
      animateTo(activeLink, 0.22, 0.10);
    });
    link.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      activeLink = link;
      // On click: snap lead fast, trail slower for satisfying snap
      animateTo(link, 0.28, 0.10);
    });
  });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    if (activeLink) snapTo(activeLink);
  });
}
