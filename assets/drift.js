/* Drive AI — inertial scroll drift (Lenis), DESKTOP ONLY.
   Smooth snappy-in / glide-out drift on mouse wheel, trackpad and keyboard.
   Phones and tablets get pure native OS momentum scrolling (smoothest + crispest,
   zero JS in the scroll path), which matters most on the WebGL scrub homepage. */
(function () {
  if (typeof Lenis === 'undefined') return;                                   // graceful: plain native scroll if lib failed to load
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;  // touch devices: 100% native scroll, no Lenis at all

  var lenis = new Lenis({
    duration: 1.0,                                                            // total glide window
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, // expo-out: catches input fast, settles smooth
    smoothWheel: true,                                                        // wheel + trackpad + keyboard
    wheelMultiplier: 1.0,
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
