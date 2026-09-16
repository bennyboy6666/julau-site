/* julau-v12 · commun aux trois versions.
   1. L'apparition du texte : IntersectionObserver, une seule fois par élément, opacity et
      transform seulement (le CSS fait le reste). Sans ce script, la classe .js n'est pas posée
      et tout le texte est visible d'emblée.
   2. La bascule clair/sombre, mémorisée.
   La maquette de réservation qui vivait ici (faux envoi) est retirée le 15 sept. au soir : le vrai
   calendrier Cal est public, les boutons y mènent. */
(function () {
  'use strict';
  /* 1. apparition. Un .rv « feuille » (titre, paragraphe, bouton, image) entre seul ; un .rv
     « groupe » (une carte, une bande de tuiles, un bloc titre + texte) fait entrer ses enfants
     l'un après l'autre, 70 ms d'écart, posé dans --i. La classe .js n'est mise que si
     l'observateur existe : sinon rien n'est caché, la page reste lisible. */
  var cibles = document.querySelectorAll('.rv');
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduit && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    var FEUILLES = { H1: 1, H2: 1, H3: 1, P: 1, A: 1, BUTTON: 1, IMG: 1 };
    Array.prototype.forEach.call(cibles, function (el) {
      var groupe = !FEUILLES[el.tagName] && el.childElementCount > 0;
      el.classList.add(groupe ? 'rv-groupe' : 'rv-feuille');
      if (groupe) Array.prototype.forEach.call(el.children, function (c, i) { c.style.setProperty('--i', i); });
    });
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(cibles, function (el) { io.observe(el); });
  }

  /* 2. thème */
  var tg = document.getElementById('themeToggle');
  if (tg) {
    tg.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') || 'atelier';
      var t = (cur === 'noir') ? 'atelier' : 'noir';
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('julau-theme', t); } catch (_) {}
    });
  }

})();
