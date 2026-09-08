/* ══════════════════════════════════════════════════════════════
   Peakk Media — comportamiento compartido
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── videos de Wistia ─────────────────────────────────────────
     Cada contenedor lleva data-wistia con el id del video.
     Con el id vacío queda un recuadro punteado y no rompe nada.
     ─────────────────────────────────────────────────────────── */

function cargarPlayerWistia() {
  if (document.querySelector('script[data-wistia-player]')) return;

  var playerScript = document.createElement('script');

  playerScript.src = 'https://fast.wistia.com/player.js';
  playerScript.async = true;
  playerScript.setAttribute('data-wistia-player', '1');

  document.head.appendChild(playerScript);
}

window.montarVideos = function (raiz) {
  var cajas = (raiz || document).querySelectorAll('[data-wistia]');

  if (!cajas.length) return;

  /* carga una sola vez el reproductor global de Wistia */
  cargarPlayerWistia();

  Array.prototype.forEach.call(cajas, function (caja) {
    if (caja.dataset.montado) return;

    caja.dataset.montado = '1';

    var id = (caja.getAttribute('data-wistia') || '').trim();

    if (!id) {
      caja.innerHTML =
        '<span class="video-vacio">Pegá el media-id de Wistia en data-wistia</span>';
      return;
    }

    /* Queremos solamente el media-id */
    if (!/^[a-zA-Z0-9]+$/.test(id)) {
      console.warn(
        'Wistia: data-wistia debe contener solamente el media-id:',
        id
      );

      caja.innerHTML =
        '<span class="video-vacio">Usá el media-id de Wistia, no el link completo</span>';

      return;
    }

    /* carga el JS específico del video */
    if (!document.querySelector('script[data-wistia-media="' + id + '"]')) {
      var s = document.createElement('script');

      s.src = 'https://fast.wistia.com/embed/' + id + '.js';
      s.async = true;
      s.type = 'module';
      s.setAttribute('data-wistia-media', id);

      document.head.appendChild(s);
    }

    /* crea el reproductor */
    var player = document.createElement('wistia-player');

player.setAttribute('media-id', id);

player.setAttribute(
  'aspect',
  caja.getAttribute('data-aspect') || '1.7778'
);

player.style.display = 'block';
player.style.width = '100%';

if (caja.hasAttribute('data-popover')) {
  player.setAttribute('wistia-popover', '');
}

caja.appendChild(player);
  });
};

  /* ── imágenes que todavía no subiste ──────────────────────────
     Con data-opcional, si el archivo no existe se reemplaza por un
     recuadro punteado que dice qué falta, en vez del ícono roto.
     ─────────────────────────────────────────────────────────── */

  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.hasAttribute('data-opcional')) return;

    var contenedor = img.parentElement;
    var ruta = img.getAttribute('src');
    img.remove();

    if (contenedor && !contenedor.querySelector('.video-vacio')) {
      var aviso = document.createElement('span');
      aviso.className = 'video-vacio';
      aviso.textContent = 'Falta ' + ruta;
      contenedor.appendChild(aviso);
    }
  }, true);

  /* ── aparición al hacer scroll ─────────────────────────────── */

  window.montarAparicion = function (selector) {
    var elementos = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!elementos.length) return;

    if (!('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    elementos.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      var caja = el.getBoundingClientRect();
      if (caja.top < window.innerHeight * 0.95) el.classList.add('visible');
      else obs.observe(el);
    });

    /* red de seguridad: si algo falla, todo visible a los 3 segundos */
    setTimeout(function () {
      elementos.forEach(function (el) { el.classList.add('visible'); });
    }, 3000);
  };

  /* ── lupa: ver una captura en grande ───────────────────────── */

  function lupa() {
    var caja = document.getElementById('lupa');
    if (!caja) return;

    var imagen = caja.querySelector('img');
    var pie    = caja.querySelector('.lupa-pie');
    var cerrarBtn = caja.querySelector('.lupa-cerrar');

    function abrir(fig) {
      var img = fig.querySelector('img');
      var cap = fig.querySelector('.tarjeta-pie');
      imagen.src = img.currentSrc || img.src;
      imagen.alt = img.alt;
      pie.textContent = cap ? cap.textContent.trim() : '';
      caja.classList.add('abierta');
      document.body.style.overflow = 'hidden';
      cerrarBtn.focus();
    }

    function cerrar() {
      caja.classList.remove('abierta');
      imagen.removeAttribute('src');
      document.body.style.overflow = '';
    }

    document.addEventListener('click', function (e) {
      if (e.target.closest('.lupa-cerrar')) { cerrar(); return; }
      if (e.target === caja) { cerrar(); return; }
      var fig = e.target.closest('.tarjeta--captura');
      if (fig) abrir(fig);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && caja.classList.contains('abierta')) cerrar();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    window.montarVideos(document);
    window.montarAparicion('[data-aparece]');
    window.montarAparicion('.tarjeta');
    lupa();
  });
})();
