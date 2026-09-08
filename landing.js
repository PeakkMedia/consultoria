/* ══════════════════════════════════════════════════════════════
   Peakk Media — landing (/)
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    escenarioSolucion();
    calculadora();
    faq();
    parallax();
  });

  /* ══════════ SOLUCIÓN: seis áreas en horizontal ══════════
     En pantallas grandes los paneles se recorren de costado
     mientras la sección queda fija. Si no entran, se apilan.
     ════════════════════════════════════════════════════════ */

  function escenarioSolucion() {
    var escenario = document.querySelector('[data-escenario]');
    if (!escenario) return;

    var pin       = escenario.querySelector('.pin');
    var paneles   = [].slice.call(escenario.querySelectorAll('.panel'));
    var fotos     = [].slice.call(escenario.querySelectorAll('.panel-foto'));
    var botones   = [].slice.call(escenario.querySelectorAll('.riel-botones button'));
    var contador  = escenario.querySelector('.riel-contador');
    var barra     = escenario.querySelector('.riel-barra span');
    var riel      = escenario.querySelector('.riel');
    var total     = paneles.length;
    if (!pin || !total) return;

    var fijo = null;
    var ultimo = -1;

    function alto()  { return window.innerHeight; }
    function ancho() { return window.innerWidth; }

    function acomodar(enFijo) {
      fijo = enFijo;

      if (!enFijo) {
        escenario.classList.remove('fijo');
        escenario.style.height = 'auto';
        pin.style.transform = 'none';
        pin.style.height = 'auto';
        paneles.forEach(function (p, i) {
          p.style.opacity = '1';
          p.style.transform = 'none';
          p.style.pointerEvents = 'auto';
          p.style.borderTop = i === 0 ? '' : '1px solid rgba(223,220,215,0.12)';
        });
        fotos.forEach(function (f) { f.style.transform = 'none'; f.style.maxHeight = 'none'; });
        return;
      }

      escenario.classList.add('fijo');
      var H = alto();
      var altoRiel = riel ? riel.offsetHeight : 64;
      var padTop = Math.max(28, Math.round(H * 0.07));

      escenario.style.height = (H + (total - 1) * Math.round(H * 0.85)) + 'px';
      pin.style.height = H + 'px';
      paneles.forEach(function (p) {
        p.style.borderTop = '';
        p.style.paddingTop = padTop + 'px';
        p.style.paddingBottom = (altoRiel + 20) + 'px';
      });
      fotos.forEach(function (f) { f.style.maxHeight = (H - padTop - altoRiel - 40) + 'px'; });
      ultimo = -1;
    }

    /* ¿entra un panel entero en el alto disponible? */
    function entra() {
      if (ancho() < 900) return false;
      var H = alto();
      if (H < 620) return false;
      var altoRiel = riel ? riel.offsetHeight : 64;
      var disponible = H - Math.max(28, Math.round(H * 0.07)) - altoRiel - 20;
      var necesario = paneles.reduce(function (max, p) {
        var texto = p.querySelector('.panel-texto');
        return Math.max(max, texto ? texto.scrollHeight : 0);
      }, 0);
      return necesario > 0 && necesario <= disponible;
    }

    function activo(i) {
      if (i === ultimo) return;
      ultimo = i;
      if (contador) {
        contador.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
      }
      botones.forEach(function (b, n) {
        b.style.borderTopColor = n <= i ? 'rgba(223,220,215,0.9)' : 'rgba(223,220,215,0.18)';
        b.style.color = n === i ? '#72765D' : (n < i ? 'rgba(223,220,215,0.7)' : 'rgba(223,220,215,0.4)');
      });
    }

    function pintar() {
      if (!fijo) return;
      var H = alto();
      var arriba = escenario.getBoundingClientRect().top;
      var recorrido = escenario.offsetHeight - H;
      var p = recorrido > 0 ? Math.min(1, Math.max(0, -arriba / recorrido)) : 0;

      pin.style.transform = 'translate3d(0,' + Math.round(recorrido > 0 ? p * recorrido : 0) + 'px,0)';

      var crudo = p * (total - 1);
      var i = Math.max(0, Math.min(total - 1, Math.round(crudo)));
      var W = pin.clientWidth || ancho();

      paneles.forEach(function (el, n) {
        var rel = n - crudo;
        var abs = Math.abs(rel);
        el.style.opacity = abs >= 1 ? '0' : (1 - abs * 0.55).toFixed(3);
        el.style.transform = 'translate3d(' + (rel * W).toFixed(1) + 'px,0,0)';
        el.style.pointerEvents = abs < 0.5 ? 'auto' : 'none';
      });

      fotos.forEach(function (f, n) {
        var rel = n - crudo;
        f.style.transform = 'translate3d(' + (-rel * W * 0.16).toFixed(1) + 'px,0,0) scale(' +
          (1 - Math.min(1, Math.abs(rel)) * 0.05).toFixed(3) + ')';
      });

      if (barra) barra.style.width = (p * 100).toFixed(2) + '%';
      activo(i);
    }

    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        if (!fijo) {
          var destino = paneles[parseInt(b.dataset.ir, 10) || 0];
          if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        var recorrido = escenario.offsetHeight - alto();
        var i = parseInt(b.dataset.ir, 10) || 0;
        window.scrollTo({
          top: window.scrollY + escenario.getBoundingClientRect().top + recorrido * (i / (total - 1)),
          behavior: 'smooth'
        });
      });
    });

    function decidir() {
      acomodar(false);
      if (entra()) acomodar(true);
      pintar();
    }

    decidir();
    window.addEventListener('scroll', pintar, { passive: true });

    var temporizador;
    window.addEventListener('resize', function () {
      clearTimeout(temporizador);
      temporizador = setTimeout(decidir, 140);
    });
  }

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
    [].slice.call(document.querySelectorAll('.faq-pregunta')).forEach(function (btn) {
      var panel = btn.nextElementSibling;
      var mas = btn.querySelector('.faq-mas');
      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', function () {
        var abierto = panel.style.maxHeight && panel.style.maxHeight !== '0px';
        panel.style.maxHeight = abierto ? '0px' : panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', abierto ? 'false' : 'true');
        if (mas) mas.textContent = abierto ? '+' : '–';
      });
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
