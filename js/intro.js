// ===== INTRO LOADING SCREEN =====
export function initIntro() {
  if (sessionStorage.getItem('intro_shown')) return;
  sessionStorage.setItem('intro_shown', '1');

  const dark   = (localStorage.getItem('theme') || 'dark') !== 'light';
  const bg     = dark ? '#0c0c0e' : '#f5f5f7';
  const stroke = dark ? 'white'   : '#111114';
  const fg     = dark ? '#ffffff' : '#111114';

  const style = document.createElement('style');
  style.textContent = `
    html { overflow-y: scroll; }

    #intro-screen {
      position: fixed; inset: 0; z-index: 99999;
      background: ${bg};
      display: flex; align-items: center; justify-content: center;
      flex-direction: column;
      opacity: 1;
      transition: opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #intro-screen.out { opacity: 0; pointer-events: none; }

    /* ── SVG logo ── */
    #intro-screen svg {
      width: 200px; height: 180px;
      display: block; overflow: visible;
    }
    #intro-screen .line {
      fill: none;
      stroke: ${stroke};
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 260;
      stroke-dashoffset: 260;
      animation: introDraw 1.2s cubic-bezier(0.4, 0, 1, 1) forwards;
    }
    #intro-screen .l2 {
      transform: translate(-3px, -3px);
      opacity: 0.6;
      animation:
        introDraw 1.2s cubic-bezier(0.4, 0, 1, 1) forwards,
        introMerge 1s cubic-bezier(0.42, 0, 1, 1) 1.2s forwards;
    }
    #intro-screen .l3 {
      transform: translate(-6px, -6px);
      opacity: 0.3;
      animation:
        introDraw 1.2s cubic-bezier(0.4, 0, 1, 1) forwards,
        introMerge 1s cubic-bezier(0.42, 0, 1, 1) 1.2s forwards;
    }
    #intro-screen .main {
      animation:
        introDraw 1.2s cubic-bezier(0.4, 0, 1, 1) forwards,
        introBold 0.8s cubic-bezier(0.65, 0, 0.35, 1) 2.2s forwards;
    }
    @keyframes introDraw  { to { stroke-dashoffset: 0; } }
    @keyframes introMerge { to { transform: translate(0,0); opacity: 1; } }
    @keyframes introBold  { from { stroke-width: 4; } to { stroke-width: 5.2; } }

    /* ── Text ── */
    #intro-text {
      margin-top: -8px;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px; font-weight: 300;
      letter-spacing: 6px; padding-left: 6px;
      text-transform: uppercase;
      color: ${fg};
      display: flex; align-items: center; justify-content: center;
    }
    #intro-text span {
      display: inline-block;
      opacity: 0; filter: blur(8px); transform: translateY(8px);
      animation: introChar 0.7s cubic-bezier(0.42, 0, 1, 1) forwards;
    }
    #intro-text span:nth-child(1) { animation-delay: 2.8s; }
    #intro-text span:nth-child(2) { animation-delay: 2.9s; }
    #intro-text span:nth-child(3) { animation-delay: 3.0s; }
    #intro-text span:nth-child(4) { animation-delay: 3.1s; }
    #intro-text span:nth-child(5) { animation-delay: 3.2s; }
    #intro-text span:nth-child(6) { animation-delay: 3.3s; }
    #intro-text span:nth-child(7) { animation-delay: 3.4s; }
    @keyframes introChar { to { opacity: 1; filter: blur(0); transform: translateY(0); } }
  `;
  document.head.appendChild(style);

  const el = document.createElement('div');
  el.id = 'intro-screen';
  el.innerHTML = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="line l3">
        <path d="M25 30 Q50 60 75 30"/>
        <path d="M25 75 L25 60 Q35 58 50 75 Q65 58 75 60 L75 75"/>
      </g>
      <g class="line l2">
        <path d="M25 30 Q50 60 75 30"/>
        <path d="M25 75 L25 60 Q35 58 50 75 Q65 58 75 60 L75 75"/>
      </g>
      <g class="line main">
        <path d="M25 30 Q50 60 75 30"/>
        <path d="M25 75 L25 60 Q35 58 50 75 Q65 58 75 60 L75 75"/>
      </g>
    </svg>
    <div id="intro-text">
      <span>V</span><span>a</span><span>m</span><span>o</span><span>r</span><span>a</span><span>x</span>
    </div>
  `;
  document.body.prepend(el);

  // Total: draw 1.2s + merge 1s + bold 0.8s + text 3.4+0.7 = ~4.2s + buffer
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => { el.remove(); style.remove(); }, 800);
  }, 4300);
}
