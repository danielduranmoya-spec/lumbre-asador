/* =========================================================
   LUMBRE Asador · script
   Lo editable está al principio: CONFIG (contacto, horario,
   turnos de reserva) y CARTA (platos, precios y alérgenos).
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Datos editables ---------- */
  var CONFIG = {
    telefono: '+34600000000',          // para los enlaces tel:
    telefonoVisible: '600 000 000',    // como se muestra en la web
    whatsapp: '34600000000',           // número para wa.me, sin + ni espacios
    mensaje: 'Hola, quiero hacer una consulta en LUMBRE.',
    zonaHoraria: 'Europe/Madrid',
    // Horario de apertura. 0 = domingo, 1 = lunes … 6 = sábado.
    horario: {
      0: [['13:30', '16:30']],
      1: [],
      2: [['13:30', '16:00'], ['20:30', '23:30']],
      3: [['13:30', '16:00'], ['20:30', '23:30']],
      4: [['13:30', '16:00'], ['20:30', '23:30']],
      5: [['13:30', '16:00'], ['20:30', '23:30']],
      6: [['13:30', '16:00'], ['20:30', '23:30']]
    },
    // Horas que se pueden reservar en cada turno. Un día que no aparece usa «normal».
    turnos: {
      comida: { normal: ['13:30', '14:00', '14:30', '15:00', '15:30'], 0: ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00'] },
      cena: { normal: ['20:30', '21:00', '21:30', '22:00', '22:30', '23:00'], 0: [] }
    },
    diasCerrados: [1],          // lunes
    maxPersonas: 12,
    diasAntelacion: 60,
    margenMinutos: 30,          // no se puede reservar para dentro de menos de 30 min
    // Fotos que ya están subidas a la carpeta img/. Añade aquí el nombre de cada una
    // (por ejemplo 'carta-brasa.jpg') y se mostrará en lugar de su hueco. Lista completa en IMAGENES.md.
    fotos: [],
    mapa: 'https://www.openstreetmap.org/export/embed.html?bbox=-6.3492%2C38.9153%2C-6.3372%2C38.9213&layer=mapnik&marker=38.9183%2C-6.3432',
    claveConsentimiento: 'lumbre-consent'
  };

  var ALERGENOS = {
    gluten: 'Gluten',
    lacteos: 'Lácteos',
    huevo: 'Huevo',
    frutos: 'Frutos secos',
    sulfitos: 'Sulfitos'
  };

  var ORDEN_CARTA = ['brasa', 'entrantes', 'quesos', 'postres', 'vinos'];

  var CARTA = {
    brasa: {
      nombre: 'Brasa',
      nota: 'Toda la carne se hace sobre brasa de encina, sin gas ni planchas. Te recomendamos el punto, pero lo eliges tú.',
      foto: { src: 'img/carta-brasa.jpg', alt: 'Presa ibérica cortada en láminas sobre una tabla de madera' },
      platos: [
        { nombre: 'Secreto ibérico de bellota', desc: '250 g, con patatas a lo pobre y pimiento asado.', precio: '19,50 €', alergenos: [] },
        { nombre: 'Presa ibérica', desc: '300 g, en láminas con sal en escamas.', precio: '22,00 €', alergenos: [] },
        { nombre: 'Pluma ibérica', desc: '250 g, con mojo de pimentón de La Vera.', precio: '20,50 €', alergenos: [] },
        { nombre: 'Chuletón de ternera retinta', desc: '1 kg aproximado, para compartir entre dos o tres.', precio: '52,00 €', alergenos: [] },
        { nombre: 'Costillas ibéricas glaseadas', desc: 'Lacadas con miel de las Villuercas y romero.', precio: '17,00 €', alergenos: [] },
        { nombre: 'Verduras de temporada a la brasa', desc: 'Con aceite de oliva virgen extra de Monterrubio.', precio: '12,00 €', alergenos: [] }
      ]
    },
    entrantes: {
      nombre: 'Entrantes',
      nota: 'Para abrir boca mientras se hace la brasa. Las raciones están pensadas para compartir entre dos.',
      foto: { src: 'img/carta-entrantes.jpg', alt: 'Migas extremeñas con uvas y huevo frito en una cazuela de barro' },
      platos: [
        { nombre: 'Jamón ibérico de bellota', desc: '100 g cortado a cuchillo, D.O.P. Dehesa de Extremadura, con pan de pueblo.', precio: '24,00 €', alergenos: ['gluten'] },
        { nombre: 'Migas extremeñas', desc: 'Con uvas, pimiento y huevo frito.', precio: '9,50 €', alergenos: ['gluten', 'huevo'] },
        { nombre: 'Croquetas de jamón ibérico', desc: 'Seis unidades, con bechamel de leche fresca.', precio: '10,00 €', alergenos: ['gluten', 'lacteos', 'huevo'] },
        { nombre: 'Tomate de las Vegas del Guadiana', desc: 'Con aceite de Monterrubio y sal en escamas.', precio: '9,00 €', alergenos: [] },
        { nombre: 'Revuelto de setas de temporada', desc: 'Con ajetes y virutas de jamón.', precio: '12,50 €', alergenos: ['huevo'] },
        { nombre: 'Pimientos asados en la brasa', desc: 'Con ajo, comino y aceite de oliva.', precio: '7,50 €', alergenos: [] }
      ]
    },
    quesos: {
      nombre: 'Quesos de la tierra',
      nota: 'Tres denominaciones de origen de Extremadura, servidas a temperatura ambiente, como deben comerse.',
      foto: { src: 'img/carta-quesos.jpg', alt: 'Torta del Casar abierta con una cuchara y tostas alrededor' },
      platos: [
        { nombre: 'Torta del Casar D.O.P.', desc: 'Entera para abrir con cuchara, con tostas de pan.', precio: '14,00 €', alergenos: ['lacteos', 'gluten'] },
        { nombre: 'Queso de La Serena D.O.P.', desc: 'Cremoso, de leche cruda de oveja merina.', precio: '13,00 €', alergenos: ['lacteos'] },
        { nombre: 'Queso Ibores D.O.P.', desc: 'De cabra, con la corteza untada en pimentón.', precio: '12,00 €', alergenos: ['lacteos'] },
        { nombre: 'Tabla de los tres quesos', desc: 'Con membrillo casero y nueces.', precio: '21,00 €', alergenos: ['lacteos', 'frutos', 'gluten'] }
      ]
    },
    postres: {
      nombre: 'Postres',
      nota: 'Dulces de la tierra hechos en casa cada mañana. Si queda hueco, la técula mécula.',
      foto: { src: 'img/carta-postres.jpg', alt: 'Porción de técula mécula con almendra laminada' },
      platos: [
        { nombre: 'Técula mécula', desc: 'Tarta de almendra y yema, receta de Olivenza.', precio: '6,50 €', alergenos: ['frutos', 'huevo', 'gluten'] },
        { nombre: 'Sopa de cerezas del Jerte', desc: 'Con helado de queso fresco. Solo en temporada.', precio: '6,50 €', alergenos: ['lacteos'] },
        { nombre: 'Perrunillas caseras', desc: 'Con un vaso de leche fría o un café.', precio: '5,00 €', alergenos: ['gluten', 'huevo', 'lacteos'] },
        { nombre: 'Higos con miel y requesón', desc: 'Miel de las Villuercas.', precio: '6,00 €', alergenos: ['lacteos'] }
      ]
    },
    vinos: {
      nombre: 'Vinos',
      nota: 'Todos de la Ribera del Guadiana. El precio es por botella; la copa va indicada en cada vino.',
      foto: { src: 'img/carta-vinos.jpg', alt: 'Copa de vino tinto junto a una botella de Ribera del Guadiana' },
      platos: [
        { nombre: 'Tinto joven Tempranillo', desc: 'Tierra de Barros, afrutado. Copa: 3,50 €.', precio: '18,00 €', alergenos: ['sulfitos'] },
        { nombre: 'Tinto crianza', desc: 'Doce meses en barrica de roble. Copa: 4,50 €.', precio: '24,00 €', alergenos: ['sulfitos'] },
        { nombre: 'Blanco Pardina', desc: 'Fresco y seco, para los quesos. Copa: 3,00 €.', precio: '15,00 €', alergenos: ['sulfitos'] },
        { nombre: 'Cava brut de Almendralejo', desc: 'Para celebrar. Copa: 4,00 €.', precio: '22,00 €', alergenos: ['sulfitos'] },
        { nombre: 'Vino de pitarra', desc: 'De la casa, en jarra de barro de medio litro. Copa: 2,50 €.', precio: '12,00 €', alergenos: ['sulfitos'] }
      ]
    }
  };

  /* ---------- Utilidades ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function waLink(msg) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg || CONFIG.mensaje);
  }
  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* sin almacenamiento: no pasa nada */ }
  }
  function toMin(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function fmtHora(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) + ':' + p[1];
  }

  // Fecha y hora actuales en Mérida, aunque el visitante esté en otro huso horario
  function nowInMerida() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: CONFIG.zonaHoraria,
        year: 'numeric', month: '2-digit', day: '2-digit',
        weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
      return {
        y: parseInt(get('year'), 10), m: parseInt(get('month'), 10), d: parseInt(get('day'), 10),
        day: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')],
        mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10)
      };
    } catch (e) {
      var d = new Date();
      return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }

  // Fechas de calendario sin husos horarios: siempre en UTC a medianoche
  function utc(y, m, d) { return new Date(Date.UTC(y, m - 1, d)); }
  function keyOf(date) { return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()); }
  function fromKey(key) { var p = key.split('-'); return utc(+p[0], +p[1], +p[2]); }
  function addDays(date, n) { return new Date(date.getTime() + n * 86400000); }
  var fmtLargo = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  var fmtMes = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------- Enlaces de contacto ---------- */
  function applyContactLinks(ctx) {
    $$('[data-wa]', ctx).forEach(function (a) {
      a.href = waLink(a.getAttribute('data-wa-msg'));
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('[data-tel]', ctx).forEach(function (a) { a.href = 'tel:' + CONFIG.telefono; });
    $$('[data-tel-text]', ctx).forEach(function (el) { el.textContent = CONFIG.telefonoVisible; });
  }

  /* ---------- Cabecera que se compacta ---------- */
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-compact', window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Brasas del inicio (canvas) ---------- */
  function initEmbers() {
    var canvas = $('[data-embers]');
    var hero = $('[data-hero]');
    if (!canvas || !hero || reduceMotion) return;
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    var MAX = 40;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, parts = [], running = false, inView = true, raf = 0, last = 0;

    function resize() {
      var r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(p, anywhere) {
      p.x = Math.random() * w;
      p.y = anywhere ? h * (0.35 + Math.random() * 0.65) : h + 8;
      p.r = 0.8 + Math.random() * 1.8;
      p.vy = 16 + Math.random() * 40;
      p.vx = (Math.random() - 0.5) * 12;
      p.life = anywhere ? Math.random() * 3 : 0;
      p.max = 3 + Math.random() * 5;
      p.phase = Math.random() * Math.PI * 2;
      p.hot = Math.random() < 0.35;
      return p;
    }
    function frame(t) {
      if (!running) return;
      var dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016;
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.life += dt;
        p.y -= p.vy * dt;
        p.x += p.vx * dt + Math.sin(p.life * 1.6 + p.phase) * 0.25;
        var k = p.life / p.max;
        if (k >= 1 || p.y < -8) { spawn(p, false); continue; }
        var a = Math.sin(Math.PI * k) * 0.85;
        ctx.fillStyle = 'rgba(217, 87, 43, ' + (a * 0.22).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = p.hot ? 'rgba(242, 166, 110, ' + a.toFixed(3) + ')' : 'rgba(217, 87, 43, ' + a.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = window.requestAnimationFrame(frame);
    }
    function start() {
      if (running || !inView || document.hidden) return;
      running = true; last = 0;
      raf = window.requestAnimationFrame(frame);
    }
    function stop() { running = false; window.cancelAnimationFrame(raf); }

    resize();
    for (var i = 0; i < MAX; i++) parts.push(spawn({}, true));

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    start();
  }

  /* ---------- Fotos: solo se piden las que ya están subidas ---------- */
  function hasPhoto(src) {
    return CONFIG.fotos.indexOf(src.split('/').pop()) !== -1;
  }
  function initPhotos() {
    $$('img[data-photo]').forEach(function (img) {
      var src = img.getAttribute('data-photo');
      if (!hasPhoto(src)) return;
      img.src = src;
      img.hidden = false;
    });
  }
  function photoMarkup(f) {
    var img = hasPhoto(f.src) ? '<img src="' + f.src + '" alt="' + f.alt + '" loading="lazy">' : '';
    return '<figure class="ph" style="aspect-ratio: 4 / 3">' + img +
      '<figcaption class="ph__label"' + (img ? ' aria-hidden="true"' : '') + '><svg aria-hidden="true"><use href="#i-camera"/></svg><span>' + f.alt + '</span></figcaption>' +
      '</figure>';
  }

  /* ---------- Carta con filtros ---------- */
  function allergensMarkup(list) {
    if (!list || !list.length) return '';
    var names = list.map(function (k) { return ALERGENOS[k].toLowerCase(); }).join(', ');
    return '<p class="dish__allergens" aria-label="Alérgenos: ' + names + '">' + list.map(function (k) {
      return '<span title="' + ALERGENOS[k] + '"><svg aria-hidden="true"><use href="#al-' + k + '"/></svg></span>';
    }).join('') + '</p>';
  }

  function initMenu() {
    var section = $('#carta');
    var filtersWrap = $('[data-menu-filters]');
    var aside = $('[data-menu-aside]');
    var list = $('[data-menu-list]');
    if (!section || !filtersWrap || !aside || !list) return;

    var filters = $$('.filter', filtersWrap);
    var current = 'brasa';
    var t1 = null, t2 = null;

    function render(cat) {
      var c = CARTA[cat];
      var idx = ORDEN_CARTA.indexOf(cat) + 1;
      aside.innerHTML =
        '<p class="mono menu__count">Categoría ' + pad(idx) + ' / ' + pad(ORDEN_CARTA.length) + '</p>' +
        '<h3 class="menu__cat">' + c.nombre + '</h3>' +
        '<p class="menu__note">' + c.nota + '</p>' +
        photoMarkup(c.foto);
      list.innerHTML = c.platos.map(function (p, i) {
        return '<li class="dish" style="--n:' + (i + 1) + '">' +
          '<div class="dish__top"><h4 class="dish__name">' + p.nombre + '</h4><p class="dish__price">' + p.precio + '</p></div>' +
          '<p class="dish__desc">' + p.desc + '</p>' +
          allergensMarkup(p.alergenos) +
          '</li>';
      }).join('');
    }

    function select(cat) {
      if (!CARTA[cat] || cat === current) return;
      current = cat;
      filters.forEach(function (f) { f.setAttribute('aria-pressed', String(f.getAttribute('data-cat') === cat)); });
      if (reduceMotion) { render(cat); return; }
      clearTimeout(t1); clearTimeout(t2);
      section.classList.remove('is-entering');
      section.classList.add('is-leaving');
      t1 = setTimeout(function () {
        render(cat);
        section.classList.remove('is-leaving');
        void section.offsetWidth; // reinicia la animación de entrada
        section.classList.add('is-entering');
        t2 = setTimeout(function () { section.classList.remove('is-entering'); }, 600);
      }, 130);
    }

    filters.forEach(function (f) {
      f.addEventListener('click', function () { select(f.getAttribute('data-cat')); });
    });
    filtersWrap.addEventListener('keydown', function (e) {
      var i = filters.indexOf(document.activeElement);
      if (i === -1) return;
      var next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % filters.length;
      else if (e.key === 'ArrowLeft') next = (i - 1 + filters.length) % filters.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = filters.length - 1;
      if (next === null) return;
      e.preventDefault();
      filters[next].focus();
      select(filters[next].getAttribute('data-cat'));
    });

    render(current);
  }

  /* ---------- Reservas en tres pasos ---------- */
  function initBooking() {
    var form = $('[data-booking]');
    if (!form) return;

    var steps = $$('.step', form);
    var stepLabels = $$('[data-step-label]', form);
    var confirm = $('[data-confirm]', form);
    var grid = $('[data-cal-grid]', form);
    var monthLabel = $('[data-cal-month]', form);
    var prevBtn = $('[data-cal-prev]', form);
    var nextBtn = $('[data-cal-next]', form);
    var slotsWrap = $('[data-slots]', form);
    var slotsHint = $('[data-slots-hint]', form);
    var peopleValue = $('[data-people-value]', form);
    var peopleBtns = $$('[data-people]', form);
    var turnInputs = $$('input[name="turno"]', form);

    var now = nowInMerida();
    var today = utc(now.y, now.m, now.d);
    var maxDate = addDays(today, CONFIG.diasAntelacion);

    var state = {
      step: 1,
      fecha: null,
      personas: 2,
      turno: 'comida',
      hora: null,
      zona: 'indiferente'
    };
    var view = { y: now.y, m: now.m };
    var busy = false;

    var ZONAS = { terraza: 'Terraza', interior: 'Interior', indiferente: 'Sin preferencia' };

    function slotsFor(date, turno) {
      var dow = date.getUTCDay();
      var conf = CONFIG.turnos[turno];
      var list = conf[dow] !== undefined ? conf[dow] : conf.normal;
      var isToday = keyOf(date) === keyOf(today);
      return list.map(function (h) {
        return { hora: h, libre: !isToday || toMin(h) >= now.mins + CONFIG.margenMinutos };
      });
    }
    function hasFreeSlots(date, turno) {
      return slotsFor(date, turno).some(function (s) { return s.libre; });
    }
    function dayStatus(date) {
      if (date < today || date > maxDate) return 'fuera';
      if (CONFIG.diasCerrados.indexOf(date.getUTCDay()) !== -1) return 'cerrado';
      if (!hasFreeSlots(date, 'comida') && !hasFreeSlots(date, 'cena')) return 'completo';
      return 'libre';
    }

    /* Calendario */
    function renderCalendar() {
      var first = utc(view.y, view.m, 1);
      var offset = (first.getUTCDay() + 6) % 7; // semana de lunes a domingo
      var days = new Date(Date.UTC(view.y, view.m, 0)).getUTCDate();
      monthLabel.textContent = capitalize(fmtMes.format(first));

      var html = '';
      for (var b = 0; b < offset; b++) html += '<span class="day day--blank" aria-hidden="true"></span>';
      for (var d = 1; d <= days; d++) {
        var date = utc(view.y, view.m, d);
        var key = keyOf(date);
        var st = dayStatus(date);
        var label = fmtLargo.format(date);
        var cls = 'day';
        if (key === keyOf(today)) cls += ' is-today';
        if (st === 'cerrado') { cls += ' is-closed'; label += ', cerrado'; }
        if (st === 'completo') label += ', sin horas libres';
        html += '<button type="button" class="' + cls + '" data-date="' + key + '" aria-label="' + label + '"' +
          ' aria-pressed="' + (state.fecha === key) + '"' + (st !== 'libre' ? ' disabled' : '') + '>' + d + '</button>';
      }
      grid.innerHTML = html;

      var firstOfToday = utc(now.y, now.m, 1);
      var lastAllowedMonth = utc(maxDate.getUTCFullYear(), maxDate.getUTCMonth() + 1, 1);
      prevBtn.disabled = first <= firstOfToday;
      nextBtn.disabled = first >= lastAllowedMonth;
    }

    function moveMonth(delta) {
      var m = view.m + delta, y = view.y;
      if (m < 1) { m = 12; y--; }
      if (m > 12) { m = 1; y++; }
      view = { y: y, m: m };
      renderCalendar();
    }

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest('.day[data-date]');
      if (!btn || btn.disabled) return;
      state.fecha = btn.getAttribute('data-date');
      $$('.day[data-date]', grid).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      hideError('date');
      syncTurn();
      updateSummary(['fecha', 'hora']);
    });
    grid.addEventListener('keydown', function (e) {
      var btn = e.target.closest('.day[data-date]');
      if (!btn) return;
      var delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (!delta) return;
      e.preventDefault();
      var target = keyOf(addDays(fromKey(btn.getAttribute('data-date')), delta));
      var el = $('.day[data-date="' + target + '"]', grid);
      if (el) el.focus();
    });
    prevBtn.addEventListener('click', function () { moveMonth(-1); });
    nextBtn.addEventListener('click', function () { moveMonth(1); });

    /* Personas, turno y hora */
    function renderPeople() {
      peopleValue.textContent = String(state.personas);
      peopleBtns.forEach(function (b) {
        var d = parseInt(b.getAttribute('data-people'), 10);
        b.disabled = (d < 0 && state.personas <= 1) || (d > 0 && state.personas >= CONFIG.maxPersonas);
      });
    }
    peopleBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var d = parseInt(b.getAttribute('data-people'), 10);
        state.personas = Math.max(1, Math.min(CONFIG.maxPersonas, state.personas + d));
        renderPeople();
        updateSummary(['personas']);
      });
    });

    // Ajusta los turnos al día elegido (el domingo no hay cena; hoy puede que no queden horas)
    function syncTurn() {
      var date = state.fecha ? fromKey(state.fecha) : null;
      turnInputs.forEach(function (input) {
        input.disabled = date ? !hasFreeSlots(date, input.value) : false;
      });
      var currentInput = turnInputs.filter(function (i) { return i.value === state.turno; })[0];
      if (currentInput && currentInput.disabled) {
        var alt = turnInputs.filter(function (i) { return !i.disabled; })[0];
        if (alt) state.turno = alt.value;
      }
      turnInputs.forEach(function (i) { i.checked = i.value === state.turno; });
      renderSlots();
    }
    turnInputs.forEach(function (input) {
      input.addEventListener('change', function () {
        if (!input.checked) return;
        state.turno = input.value;
        state.hora = null;
        renderSlots();
        updateSummary(['hora']);
      });
    });

    function renderSlots() {
      var date = state.fecha ? fromKey(state.fecha) : null;
      if (!date) { slotsWrap.innerHTML = ''; return; }
      var slots = slotsFor(date, state.turno);
      if (state.hora && !slots.some(function (s) { return s.hora === state.hora && s.libre; })) state.hora = null;
      slotsWrap.innerHTML = slots.map(function (s) {
        return '<label class="slot"><input type="radio" name="hora" value="' + s.hora + '"' +
          (state.hora === s.hora ? ' checked' : '') + (s.libre ? '' : ' disabled') + '>' +
          '<span>' + fmtHora(s.hora) + '</span></label>';
      }).join('');

      var hints = [];
      if (date.getUTCDay() === 0) hints.push('El domingo solo abrimos a mediodía.');
      if (keyOf(date) === keyOf(today)) hints.push('Para hoy solo se puede reservar con ' + CONFIG.margenMinutos + ' minutos de antelación.');
      slotsHint.hidden = !hints.length;
      slotsHint.textContent = hints.join(' ');
    }
    slotsWrap.addEventListener('change', function (e) {
      if (e.target.name !== 'hora') return;
      state.hora = e.target.value;
      hideError('slot');
      updateSummary(['hora']);
    });

    /* Zona */
    $$('input[name="zona"]', form).forEach(function (input) {
      input.addEventListener('change', function () {
        if (!input.checked) return;
        state.zona = input.value;
        updateSummary(['zona']);
      });
    });

    /* Resumen */
    function summaryText() {
      return {
        fecha: state.fecha ? capitalize(fmtLargo.format(fromKey(state.fecha))) : '—',
        hora: state.hora ? fmtHora(state.hora) + ' · ' + state.turno : '—',
        personas: String(state.personas),
        zona: ZONAS[state.zona]
      };
    }
    function updateSummary(changed) {
      var s = summaryText();
      Object.keys(s).forEach(function (k) {
        var el = $('[data-sum="' + k + '"]');
        if (!el || el.textContent === s[k]) return;
        el.textContent = s[k];
        if (changed && changed.indexOf(k) !== -1 && !reduceMotion) {
          el.classList.remove('is-updated'); void el.offsetWidth; el.classList.add('is-updated');
        }
      });
    }

    /* Errores */
    function showError(name, field) {
      var el = $('[data-error="' + name + '"]', form);
      if (el) el.hidden = false;
      if (field) field.setAttribute('aria-invalid', 'true');
    }
    function hideError(name, field) {
      var el = $('[data-error="' + name + '"]', form);
      if (el) el.hidden = true;
      if (field) field.removeAttribute('aria-invalid');
    }

    function phoneDigits(v) {
      var d = (v || '').replace(/\D/g, '');
      if (d.length === 11 && d.indexOf('34') === 0) d = d.slice(2);
      return d;
    }

    function validate(step) {
      if (step === 1) {
        if (!state.fecha) { showError('date'); return false; }
        return true;
      }
      if (step === 2) {
        if (!state.hora) { showError('slot'); return false; }
        return true;
      }
      if (step === 3) {
        var ok = true, firstBad = null;
        var nombre = form.elements.nombre;
        var tel = form.elements.telefono;
        var priv = form.elements.privacidad;
        if (nombre.value.trim().length < 2) { showError('nombre', nombre); ok = false; firstBad = firstBad || nombre; }
        else hideError('nombre', nombre);
        if (!/^[6789]\d{8}$/.test(phoneDigits(tel.value))) { showError('telefono', tel); ok = false; firstBad = firstBad || tel; }
        else hideError('telefono', tel);
        if (!priv.checked) { showError('privacidad', priv); ok = false; firstBad = firstBad || priv; }
        else hideError('privacidad', priv);
        if (firstBad) firstBad.focus();
        return ok;
      }
      return true;
    }

    ['nombre', 'telefono'].forEach(function (name) {
      form.elements[name].addEventListener('input', function () {
        if (form.elements[name].getAttribute('aria-invalid') === 'true') validateField(name);
      });
    });
    form.elements.privacidad.addEventListener('change', function () {
      if (form.elements.privacidad.checked) hideError('privacidad', form.elements.privacidad);
    });
    function validateField(name) {
      var f = form.elements[name];
      var ok = name === 'nombre' ? f.value.trim().length >= 2 : /^[6789]\d{8}$/.test(phoneDigits(f.value));
      if (ok) hideError(name, f);
    }

    /* Navegación entre pasos */
    function panelFor(n) { return n === 'confirm' ? confirm : steps[n - 1]; }

    function markSteps(n) {
      stepLabels.forEach(function (li, i) {
        var idx = i + 1;
        if (n === 'confirm' || idx < n) { li.classList.add('is-done'); li.removeAttribute('aria-current'); }
        else if (idx === n) { li.classList.remove('is-done'); li.setAttribute('aria-current', 'step'); }
        else { li.classList.remove('is-done'); li.removeAttribute('aria-current'); }
      });
    }

    function goTo(n) {
      if (busy || n === state.step) return;
      var from = panelFor(state.step);
      var to = panelFor(n);
      state.step = n;
      markSteps(n);

      function show() {
        from.hidden = true;
        from.classList.remove('is-leaving');
        to.hidden = false;
        if (!reduceMotion) {
          to.classList.remove('is-entering'); void to.offsetWidth; to.classList.add('is-entering');
        }
        var focusTarget = n === 'confirm' ? to : $('.step__legend', to);
        if (focusTarget) {
          if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
          focusTarget.focus({ preventScroll: true });
        }
        var top = form.getBoundingClientRect().top;
        if (top < 0) form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        busy = false;
      }

      if (reduceMotion) { show(); return; }
      busy = true;
      from.classList.add('is-leaving');
      setTimeout(show, 160);
    }

    $$('[data-next]', form).forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (validate(state.step)) goTo(state.step + 1);
      });
    });
    $$('[data-prev]', form).forEach(function (btn) {
      btn.addEventListener('click', function () { goTo(state.step - 1); });
    });
    $('[data-edit]', form).addEventListener('click', function () { goTo(3); });

    function buildMessage(s) {
      var lines = [
        'Hola, quiero reservar mesa en LUMBRE.',
        'Día: ' + fmtLargo.format(fromKey(state.fecha)),
        'Hora: ' + fmtHora(state.hora) + ' (' + state.turno + ')',
        'Personas: ' + state.personas,
        'Zona: ' + ZONAS[state.zona].toLowerCase(),
        'Nombre: ' + s.nombre,
        'Teléfono: ' + s.telefono
      ];
      if (s.notas) lines.push('Comentarios: ' + s.notas);
      return lines.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (state.step !== 3 || !validate(3)) return;
      var datos = {
        nombre: form.elements.nombre.value.trim(),
        telefono: phoneDigits(form.elements.telefono.value).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3'),
        notas: form.elements.notas.value.trim()
      };
      var s = summaryText();
      var rows = [
        ['Día', s.fecha],
        ['Hora', s.hora],
        ['Personas', s.personas],
        ['Zona', s.zona],
        ['Nombre', datos.nombre],
        ['Teléfono', datos.telefono]
      ];
      if (datos.notas) rows.push(['Comentarios', datos.notas]);
      var summary = $('[data-confirm-summary]', form);
      summary.innerHTML = '';
      rows.forEach(function (r) {
        var div = document.createElement('div');
        var dt = document.createElement('dt'); dt.textContent = r[0];
        var dd = document.createElement('dd'); dd.textContent = r[1];
        div.appendChild(dt); div.appendChild(dd);
        summary.appendChild(div);
      });
      $('[data-confirm-link]', form).href = waLink(buildMessage(datos));
      goTo('confirm');
    });

    renderCalendar();
    renderPeople();
    renderSlots();
    updateSummary();

    // Acceso para probar desde la consola del navegador
    window.__lumbre.reserva = state;
  }

  /* ---------- Horario: abierto ahora ---------- */
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function hoursStatus(now) {
    var today = CONFIG.horario[now.day] || [];
    for (var i = 0; i < today.length; i++) {
      if (now.mins >= toMin(today[i][0]) && now.mins < toMin(today[i][1])) {
        return { open: true, text: 'Abierto ahora · cierra a las ' + fmtHora(today[i][1]) };
      }
    }
    for (var j = 0; j < today.length; j++) {
      if (toMin(today[j][0]) > now.mins) return { open: false, text: 'Cerrado · abre hoy a las ' + fmtHora(today[j][0]) };
    }
    for (var k = 1; k <= 7; k++) {
      var d = (now.day + k) % 7;
      var tramos = CONFIG.horario[d] || [];
      if (tramos.length) {
        return { open: false, text: 'Cerrado · abre ' + (k === 1 ? 'mañana' : 'el ' + DIAS[d]) + ' a las ' + fmtHora(tramos[0][0]) };
      }
    }
    return { open: false, text: 'Cerrado' };
  }

  function initHours() {
    var status = $('[data-status]');
    var text = $('[data-status-text]');
    if (!status || !text) return;
    function update() {
      var now = nowInMerida();
      var st = hoursStatus(now);
      status.setAttribute('data-state', st.open ? 'open' : 'closed');
      text.textContent = st.text;
      $$('.hours tr[data-days]').forEach(function (tr) {
        var days = tr.getAttribute('data-days').split(',').map(Number);
        tr.classList.toggle('is-today', days.indexOf(now.day) !== -1);
      });
    }
    update();
    setInterval(update, 60 * 1000);
  }

  /* ---------- Consentimiento y mapa ---------- */
  function loadMap() {
    var box = $('[data-map]');
    if (!box || box.querySelector('iframe')) return;
    var iframe = document.createElement('iframe');
    iframe.src = CONFIG.mapa;
    iframe.title = 'Mapa con la ubicación de LUMBRE Asador en Mérida';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer';
    box.appendChild(iframe);
    var ph = $('[data-map-placeholder]');
    if (ph) ph.hidden = true;
  }
  function unloadMap() {
    var box = $('[data-map]');
    if (!box) return;
    var iframe = box.querySelector('iframe');
    if (iframe) iframe.remove();
    var ph = $('[data-map-placeholder]');
    if (ph) ph.hidden = false;
  }

  function initConsent() {
    var banner = $('[data-cookie-banner]');
    var stored = storageGet(CONFIG.claveConsentimiento);

    function hide() {
      if (!banner || banner.hidden) return;
      if (reduceMotion) { banner.hidden = true; return; }
      banner.classList.add('is-leaving');
      setTimeout(function () {
        banner.hidden = true;
        banner.classList.remove('is-leaving');
      }, 180);
    }
    function show() { if (banner) banner.hidden = false; }

    if (stored === 'accepted') loadMap();
    if (!stored) show();

    $$('[data-consent]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-consent');
        storageSet(CONFIG.claveConsentimiento, value);
        if (value === 'accepted') loadMap(); else unloadMap();
        hide();
      });
    });
    $$('[data-open-cookies]').forEach(function (btn) { btn.addEventListener('click', show); });
    var loadBtn = $('[data-map-load]');
    if (loadBtn) loadBtn.addEventListener('click', loadMap);
  }

  /* ---------- Entradas al hacer scroll ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Arranque ---------- */
  window.__lumbre = { config: CONFIG, carta: CARTA };

  function init() {
    applyContactLinks(document);
    initPhotos();
    initHeader();
    initEmbers();
    initMenu();
    initBooking();
    initHours();
    initConsent();
    initReveal();
    $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
