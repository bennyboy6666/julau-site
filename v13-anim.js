/* Une apparition par texte. Les images, les cartes et le calendrier restent fixes. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;

  var texts = Array.from(document.querySelectorAll(
    // « section li » ajoute le 16 sept. : les tuiles sont devenues des puces apres l ecriture
    // de cette couche, et une puce est du texte qui apparait, comme le reste.
    'section h1, section h2, section h3, section p, section li, section .sn, ' +
    'section .h-meta, section .etq, section .fr'
  )).filter(function (el) { return !el.closest('.resa'); });
  var pending = new Set(texts);
  var observer;

  function reveal(el, animate) {
    if (!pending.delete(el)) return;
    observer.unobserve(el);
    el.classList.remove('v13-pending');
    if (animate) {
      el.classList.add('v13-entering');
      el.addEventListener('animationend', function () {
        el.classList.remove('v13-entering');
      }, { once: true });
    }
  }

  function finish() {
    if (observer) observer.disconnect();
    texts.forEach(function (el) {
      el.classList.remove('v13-pending', 'v13-entering');
    });
    pending.clear();
    document.documentElement.classList.remove('v13-motion');
  }

  try {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) reveal(entry.target, true);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -12px 0px' });

    texts.forEach(function (el) {
      var siblings = texts.filter(function (text) { return text.parentElement === el.parentElement; });
      el.style.setProperty('--v13-delay', Math.min(siblings.indexOf(el), 2) * 40 + 'ms');
      observer.observe(el);
      el.classList.add('v13-pending');
    });
    document.documentElement.classList.add('v13-motion');

    reduced.addEventListener('change', function (event) {
      if (event.matches) finish();
    });
    document.addEventListener('focusin', function (event) {
      var el = event.target.closest('.v13-pending, .v13-entering');
      if (el) {
        reveal(el, false);
        el.classList.remove('v13-entering');
      }
    });
  } catch (_) {
    finish();
  }
})();
