(function () {
  'use strict';
  var stations = Array.prototype.slice.call(document.querySelectorAll('.station'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.dots a'));
  var scenes = Array.prototype.slice.call(document.querySelectorAll('[data-scene]'));
  var flow = document.querySelector('.flow');
  var rail = document.querySelector('.rail');

  if (!('IntersectionObserver' in window)) {
    stations.forEach(function (s) { s.classList.add('in'); });
    scenes.forEach(function (s) { s.classList.add('live'); });
    return;
  }

  // fade-in text and scene when a station enters the viewport
  var reveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
    });
  }, { threshold: 0.2 });
  stations.forEach(function (s) { reveal.observe(s); });

  // animate only the scenes that are near the viewport
  var live = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.target.classList.toggle('live', e.isIntersecting); });
  }, { rootMargin: '120px 0px' });
  scenes.forEach(function (s) { live.observe(s); });

  // highlight the station crossing the middle of the screen
  var active = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var idx = stations.indexOf(e.target);
      stations.forEach(function (s, i) { s.classList.toggle('active', i <= idx && i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    });
  }, { rootMargin: '-48% 0px -48% 0px' });
  stations.forEach(function (s) { active.observe(s); });

  // red progress fill along the vertical rail
  var ticking = false;
  function update() {
    ticking = false;
    var rect = flow.getBoundingClientRect();
    var p = (window.innerHeight * 0.5 - rect.top) / rect.height;
    rail.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(4));
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
