(function () {
  'use strict';

  var KEYS = {
    bookings: 'dcInstallations.bookings',
    quotes: 'dcInstallations.quotes',
    messages: 'dcInstallations.messages'
  };
  var SERVICES = {
    commercial: 'Commercial electrical',
    industrial: 'Industrial electrical',
    ev: 'EV charger installation',
    residential: 'Residential electrical',
    data: 'Data & networks',
    other: 'Not sure yet / general enquiry'
  };
  var WINDOWS = { morning: 'Morning', afternoon: 'Afternoon', flexible: 'Flexible' };
  var STATUS_LABEL = {
    pending: 'Awaiting confirmation',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    declined: 'Declined'
  };

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function read(k) { try { var v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function pad(n) { return String(n).padStart(2, '0'); }
  function makeRef(prefix) {
    var d = new Date();
    return prefix + '-' + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isoLocal(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }
  function formData(form) {
    var o = {};
    $$('input,select,textarea', form).forEach(function (el) {
      if (!el.name || el.type === 'file') return;
      if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) return;
      o[el.name] = el.type === 'checkbox' ? true : el.value.trim();
    });
    return o;
  }
  function notify(rec) {
    try { window.dispatchEvent(new CustomEvent('dc:bookings-changed', { detail: rec || null })); } catch (e) {}
  }
  function setStatus(box, type, html) {
    if (!box) return;
    box.className = 'status ' + type;
    box.innerHTML = html;
  }

  /* Navigation state */
  var page = location.pathname.split('/').pop() || 'index.html';
  function markNav() {
    var links = $$('.main-nav a');
    var hashMatch = links.some(function (a) { return location.hash && a.getAttribute('href') === page + location.hash; });
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      var parts = href.split('#');
      var match = false;
      if (parts[0] === page) {
        match = parts[1] ? location.hash === '#' + parts[1] : !hashMatch;
      }
      if (match) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  markNav();
  window.addEventListener('hashchange', markNav);

  /* Validation */
  function validate(form) {
    var first = null;
    var seen = {};
    $$('[aria-invalid]', form).forEach(function (el) { el.removeAttribute('aria-invalid'); });
    $$('.invalid', form).forEach(function (el) { el.classList.remove('invalid'); });
    $$('input,select,textarea', form).forEach(function (el) {
      if (!el.required) return;
      var bad = false;
      if (el.type === 'radio') {
        if (seen[el.name]) return;
        seen[el.name] = true;
        bad = !form.querySelector('input[name="' + el.name + '"]:checked');
        if (bad) { var grp = el.closest('.tiles,.seg'); if (grp) grp.classList.add('invalid'); }
      } else if (el.type === 'checkbox') {
        bad = !el.checked;
        if (bad) { var lab = el.closest('.check'); if (lab) lab.classList.add('invalid'); }
      } else {
        var v = el.value.trim();
        bad = !v ||
          (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ||
          (el.type === 'tel' && v.replace(/\D/g, '').length < 10) ||
          (el.type === 'date' && el.min && v < el.min);
        if (bad) el.setAttribute('aria-invalid', 'true');
      }
      if (bad && !first) first = el;
    });
    return first;
  }
  $$('form[novalidate]').forEach(function (f) {
    f.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid')) e.target.removeAttribute('aria-invalid');
    });
    f.addEventListener('change', function (e) {
      var grp = e.target.closest('.tiles,.seg,.check');
      if (grp) grp.classList.remove('invalid');
    });
  });

  /* File attachments */
  $$('input[type=file][data-count]').forEach(function (inp) {
    var out = document.getElementById(inp.getAttribute('data-count'));
    inp.addEventListener('change', function () {
      var n = inp.files ? inp.files.length : 0;
      if (out) out.textContent = 'Attachments (' + n + ')' + (n ? ': ' + Array.prototype.map.call(inp.files, function (f) { return f.name; }).join(', ') : '');
    });
  });

  /* Quote form */
  var qf = $('#quote-form');
  if (qf) {
    qf.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = $('#quote-status');
      var bad = validate(qf);
      if (bad) { setStatus(out, 'error', 'Please complete the highlighted fields.'); bad.focus(); return; }
      var d = formData(qf);
      var files = $('#q-files');
      var rec = {
        id: makeRef('Q'), kind: 'quote', status: 'new', source: 'website',
        createdAt: new Date().toISOString(),
        name: d.name, email: d.email, phone: d.phone, details: d.details || '',
        attachments: files && files.files ? Array.prototype.map.call(files.files, function (f) { return f.name; }) : []
      };
      var list = read(KEYS.quotes); list.push(rec);
      if (!write(KEYS.quotes, list)) { setStatus(out, 'error', 'Sorry, your request could not be saved. Please call <a href="tel:07973241669">07973241669</a>.'); return; }
      setStatus(out, 'ok', '<b>Thank you, ' + esc(d.name) + '.</b><p>Your quote request (ref ' + esc(rec.id) + ') has been recorded. For a faster response, call <a href="tel:07973241669">07973241669</a>.</p>');
      qf.reset();
      var cnt = $('#q-count'); if (cnt) cnt.textContent = 'Attachments (0)';
    });
  }

  /* Contact form */
  var cf = $('#contact-form');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = $('#contact-status');
      var bad = validate(cf);
      if (bad) { setStatus(out, 'error', 'Please enter a valid email address.'); bad.focus(); return; }
      var d = formData(cf);
      var rec = { id: makeRef('M'), kind: 'message', status: 'new', source: 'website', createdAt: new Date().toISOString(), name: d.name || '', email: d.email, message: d.message || '' };
      var list = read(KEYS.messages); list.push(rec);
      if (!write(KEYS.messages, list)) { setStatus(out, 'error', 'Sorry, your message could not be saved. Please call <a href="tel:07973241669">07973241669</a>.'); return; }
      setStatus(out, 'ok', '<b>Thanks' + (d.name ? ', ' + esc(d.name) : '') + '.</b><p>Your message has been recorded (ref ' + esc(rec.id) + ').</p>');
      cf.reset();
    });
  }

  /* Booking system */
  function updateBooking(id, status, note) {
    var list = read(KEYS.bookings);
    var rec = null;
    list.forEach(function (b) {
      if (b.id === id) {
        b.status = status;
        b.updatedAt = new Date().toISOString();
        b.history = b.history || [];
        b.history.push({ status: status, at: b.updatedAt, note: note || '' });
        rec = b;
      }
    });
    if (rec) { write(KEYS.bookings, list); notify(rec); }
    return rec;
  }
  function removeBooking(id) {
    var list = read(KEYS.bookings);
    var next = list.filter(function (b) { return b.id !== id; });
    write(KEYS.bookings, next);
    notify(null);
    return next.length !== list.length;
  }

  window.DCBookings = {
    keys: KEYS,
    services: SERVICES,
    statuses: STATUS_LABEL,
    all: function () { return read(KEYS.bookings); },
    get: function (id) { return read(KEYS.bookings).filter(function (b) { return b.id === id; })[0] || null; },
    setStatus: updateBooking,
    remove: removeBooking,
    quotes: function () { return read(KEYS.quotes); },
    messages: function () { return read(KEYS.messages); }
  };

  function renderMine() {
    var box = $('#my-bookings');
    if (!box) return;
    var mine = read(KEYS.bookings).filter(function (b) { return b.source === 'website'; })
      .sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
    if (!mine.length) {
      box.innerHTML = '<p class="muted">No booking requests yet. Requests you make on this device will appear here.</p>';
      return;
    }
    box.innerHTML = '<ul class="mine">' + mine.map(function (b) {
      return '<li><div class="mine-top"><b>' + esc(b.id) + '</b><span class="badge badge-' + esc(b.status) + '">' + esc(STATUS_LABEL[b.status] || b.status) + '</span></div>' +
        '<p>' + esc(b.serviceLabel) + '<br>' + esc(fmtDate(b.preferredDate)) + ', ' + esc(WINDOWS[b.timeWindow] || '') + '</p>' +
        (b.status === 'pending' ? '<button type="button" class="link-btn" data-cancel="' + esc(b.id) + '">Cancel this request</button>' : '') + '</li>';
    }).join('') + '</ul>';
  }

  var bf = $('#booking-form');
  if (bf) {
    var tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    var minIso = isoLocal(tomorrow);
    $$('input[type=date]', bf).forEach(function (d) { d.min = minIso; });

    var params = new URLSearchParams(location.search);
    var pre = params.get('service');
    if (pre && SERVICES[pre]) {
      var r = bf.querySelector('input[name="service"][value="' + pre + '"]');
      if (r) r.checked = true;
    }

    bf.addEventListener('submit', function (e) {
      e.preventDefault();
      var out = $('#booking-status');
      var bad = validate(bf);
      if (bad) {
        setStatus(out, 'error', 'Please complete the highlighted fields. Visit dates must be from tomorrow onwards.');
        bad.focus();
        return;
      }
      var d = formData(bf);
      var now = new Date().toISOString();
      var rec = {
        id: makeRef('DC'), kind: 'booking', source: 'website', status: 'pending',
        createdAt: now, updatedAt: now,
        service: d.service, serviceLabel: SERVICES[d.service] || d.service,
        sector: d.sector || '', jobType: d.jobType || '', details: d.details || '',
        preferredDate: d.date, timeWindow: d.window, alternativeDate: d.altDate || '',
        name: d.name, phone: d.phone, email: d.email,
        address: d.address || '', postcode: (d.postcode || '').toUpperCase(),
        contactPreference: d.contactPref || 'phone',
        history: [{ status: 'pending', at: now, note: 'Requested online' }]
      };
      var list = read(KEYS.bookings); list.push(rec);
      if (!write(KEYS.bookings, list)) {
        setStatus(out, 'error', 'Sorry, your booking could not be saved. Please call <a href="tel:07973241669">07973241669</a>.');
        return;
      }
      setStatus(out, 'ok', '<b>Booking request ' + esc(rec.id) + ' recorded.</b><p>Thank you, ' + esc(rec.name) + '. You asked for <strong>' + esc(rec.serviceLabel) + '</strong> on ' + esc(fmtDate(rec.preferredDate)) + ' (' + esc(WINDOWS[rec.timeWindow]) + '). DC INSTALLATIONS will confirm the appointment with you. For anything urgent, call <a href="tel:07973241669">07973241669</a>.</p>');
      bf.reset();
      $$('input[type=date]', bf).forEach(function (dd) { dd.min = minIso; });
      notify(rec);
      renderMine();
      out.scrollIntoView({ block: 'nearest' });
    });

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cancel]');
      if (!btn) return;
      var id = btn.getAttribute('data-cancel');
      if (window.confirm('Cancel booking request ' + id + '?')) {
        updateBooking(id, 'cancelled', 'Cancelled by customer');
        renderMine();
      }
    });
    window.addEventListener('storage', function (e) { if (e.key === KEYS.bookings) renderMine(); });
    window.addEventListener('dc:bookings-changed', renderMine);
    renderMine();
  }
})();
