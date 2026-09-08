/* ══════════════════════════════════════════════════════════════
   Peakk Media — landing (/)
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    calculadora();
    faq();
    parallax();
  });

  /* ══════════ CALCULADORA ══════════ */

  function calculadora() {
    var caja = document.querySelector('[data-calc]');
    if (!caja) return;

    var campos = {};
    [].slice.call(caja.querySelectorAll('input[type=range]')).forEach(function (i) {
      campos[i.dataset.campo] = i;
    });

    var nf = new Intl.NumberFormat('es-AR');
    function plata(n) { return '$' + nf.format(Math.round(n)); }
    function dec(n, d) { return n.toFixed(d).replace('.', ','); }
    function poner(nombre, valor) {
      [].slice.call(caja.querySelectorAll('[data-out="' + nombre + '"]')).forEach(function (el) {
        el.textContent = valor;
      });
    }

    function calcular() {
      var sesiones  = +campos.sesiones.value;
      var conv      = +campos.conv.value / 100;
      var ticket    = +campos.ticket.value;
      var inversion = +campos.inversion.value;
      var cpm       = +campos.cpm.value / 10;
      var ctr       = +campos.ctr.value / 10;

      var clics    = (inversion / cpm) * 1000 * (ctr / 100);
      var visitas  = sesiones + clics;
      var actual   = visitas * (conv / 100) * ticket;

      var convMej   = conv + 0.5;
      var cpmMej    = cpm * 0.75;
      var ctrMej    = ctr * 1.4;
      var ticketMej = ticket * 1.15;
      var clicsMej   = (inversion / cpmMej) * 1000 * (ctrMej / 100);
      var visitasMej = sesiones + clicsMej;
      var mejorado   = visitasMej * (convMej / 100) * ticketMej;

      poner('sesiones', nf.format(sesiones));
      poner('conv', dec(conv, 2) + '%');
      poner('convMej', dec(convMej, 2) + '%');
      poner('ticket', '$' + ticket);
      poner('ticketMej', '$' + Math.round(ticketMej));
      poner('inversion', plata(inversion));
      poner('cpm', '$' + dec(cpm, 1));
      poner('cpmMej', '$' + dec(cpmMej, 1));
      poner('ctr', dec(ctr, 1) + '%');
      poner('ctrMej', dec(ctrMej, 1) + '%');
      poner('clics', nf.format(Math.round(clics)));
      poner('visitas', nf.format(Math.round(visitas)));
      poner('roas', dec(inversion ? actual / inversion : 0, 1) + 'x');
      poner('roasMej', dec(inversion ? mejorado / inversion : 0, 1) + 'x');
      poner('actual', plata(actual));
      poner('mejorado', plata(mejorado));
      poner('brecha', plata(Math.max(0, mejorado - actual)));
      poner('anual', plata(Math.max(0, mejorado - actual) * 12));
    }

    Object.keys(campos).forEach(function (k) {
      campos[k].addEventListener('input', calcular);
    });

    calcular();
  }

  /* ══════════ FAQ ══════════ */

  function faq() {
    var items = [].slice.call(document.querySelectorAll('.faq-pregunta')).map(function (btn) {
      return { btn: btn, panel: btn.nextElementSibling, mas: btn.querySelector('.faq-mas') };
    });

    function cerrar(it) {
      it.panel.style.maxHeight = '0px';
      it.btn.setAttribute('aria-expanded', 'false');
      it.btn.classList.remove('abierta');
      if (it.mas) it.mas.textContent = '+';
    }

    function abrir(it) {
      it.panel.style.maxHeight = it.panel.scrollHeight + 'px';
      it.btn.setAttribute('aria-expanded', 'true');
      it.btn.classList.add('abierta');
      if (it.mas) it.mas.textContent = '–';
    }

    items.forEach(function (it) {
      cerrar(it);

      it.btn.addEventListener('click', function () {
        var estaAbierta = it.btn.getAttribute('aria-expanded') === 'true';

        /* solo una abierta a la vez: al tocar otra, la anterior se cierra */
        items.forEach(function (otra) { if (otra !== it) cerrar(otra); });

        if (estaAbierta) cerrar(it);
        else abrir(it);
      });
    });

    /* si cambia el ancho, recalcula el alto de la que este abierta */
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        items.forEach(function (it) {
          if (it.btn.getAttribute('aria-expanded') === 'true') {
            it.panel.style.maxHeight = it.panel.scrollHeight + 'px';
          }
        });
      }, 140);
    });
  }

  /* ══════════ PARALLAX SUAVE ══════════ */

  function parallax() {
    var capas = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (!capas.length) return;

    function mover() {
      var y = window.scrollY;
      capas.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var base = el.dataset.centrado === '1' ? 'translateX(-50%) ' : '';
        el.style.transform = base + 'translate3d(0,' + (y * f).toFixed(1) + 'px,0)';
      });
    }

    window.addEventListener('scroll', mover, { passive: true });
    mover();
  }
})();
