/* Drive AI — unified inertial scroll drift (Lenis).
   Snappy in, smooth glide out. Active on desktop (wheel/trackpad/keys)
   AND touch (phones/tablets). One source of truth for the whole site. */
(function () {
  if (typeof Lenis === 'undefined') return;                                   // graceful: plain native scroll if lib failed to load
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lenis = new Lenis({
    duration: 1.0,                                                            // total glide window
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, // expo-out: catches input fast, settles smooth
    smoothWheel: true,                                                        // wheel + trackpad + keyboard
    wheelMultiplier: 1.0,
    syncTouch: false,                                                         // native OS momentum on touch = buttery + crisp; Lenis drift stays on desktop wheel
    gestureOrientation: 'vertical'
  });

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  window.__lenis = lenis;                                                     // exposed for measurement / debugging

  // Pause drift (and lock the background) while the mobile nav drawer is open.
  var nav = document.getElementById('nav');
  if (nav && window.MutationObserver) {
    new MutationObserver(function () {
      if (nav.classList.contains('open')) lenis.stop(); else lenis.start();
    }).observe(nav, { attributes: true, attributeFilter: ['class'] });
  }
})();
