/* SUN DRIVE CARS — vanilla JS: nav, reveal, sticky CTA, booking form → WhatsApp */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var LANG = (document.documentElement.lang || 'en').slice(0, 2);
  var WA_NUMBER = '212661644244';

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Sticky mobile CTA ---------- */
  var sticky = document.querySelector('.sticky-cta');
  if (sticky) {
    try {
      if (sessionStorage.getItem('sdc-cta-dismissed') === '1') {
        sticky.classList.add('dismissed');
        document.body.classList.add('cta-dismissed');
      }
    } catch (e) { /* storage unavailable */ }
    var closeBtn = sticky.querySelector('.sticky-cta-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        sticky.classList.add('dismissed');
        document.body.classList.add('cta-dismissed');
        try { sessionStorage.setItem('sdc-cta-dismissed', '1'); } catch (e) { /* noop */ }
      });
    }
  }

  /* ---------- Date minimums ---------- */
  var today = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('input[type="date"]').forEach(function (el) {
    if (!el.min) el.min = today;
  });

  /* ---------- Booking form ---------- */
  var form = document.getElementById('booking-form');
  if (!form) return;

  var pickupLoc = form.querySelector('#pickup-location');
  var flightWrap = form.querySelector('#flight-field');
  var flightInput = form.querySelector('#flight');

  function syncFlight() {
    var isAirport = pickupLoc && pickupLoc.value === 'airport';
    if (flightWrap) flightWrap.classList.toggle('hidden', !isAirport);
  }
  if (pickupLoc) {
    pickupLoc.addEventListener('change', syncFlight);
  }

  /* Return date can never precede pickup date */
  var fromDate = form.querySelector('#pickup-date');
  var toDate = form.querySelector('#return-date');
  function syncReturnMin() {
    if (fromDate && toDate) toDate.min = fromDate.value || today;
  }
  if (fromDate) fromDate.addEventListener('change', syncReturnMin);

  /* Prefill from home mini-form query params */
  var params = new URLSearchParams(window.location.search);
  var map = { pickup: 'pickup-location', from: 'pickup-date', to: 'return-date', car: 'car' };
  Object.keys(map).forEach(function (key) {
    var val = params.get(key);
    var el = document.getElementById(map[key]);
    if (val && el) el.value = val;
  });
  syncFlight();
  syncReturnMin();

  function fmtDate(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
  }

  function selectedText(sel) {
    return sel && sel.selectedIndex > -1 ? sel.options[sel.selectedIndex].text : '';
  }

  var T = LANG === 'fr' ? {
    intro: 'Bonjour Sun Drive Cars ! Je souhaite demander un devis :',
    pickup: 'Prise en charge', ret: 'Restitution', at: 'à',
    flight: 'Vol', car: 'Voiture', name: 'Nom', wa: 'WhatsApp',
    email: 'E-mail', notes: 'Remarques', nopref: 'Sans préférence',
    required: 'Merci de remplir ce champ.'
  } : {
    intro: "Hello Sun Drive Cars! I'd like to request a quote:",
    pickup: 'Pickup', ret: 'Return', at: 'at',
    flight: 'Flight', car: 'Car', name: 'Name', wa: 'WhatsApp',
    email: 'Email', notes: 'Notes', nopref: 'No preference',
    required: 'Please fill in this field.'
  };

  var SEP = LANG === 'fr' ? ' : ' : ': ';

  function buildMessage() {
    var v = function (id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };
    var lines = [T.intro];
    lines.push('\u2022 ' + T.pickup + SEP + selectedText(pickupLoc) +
      ' \u2014 ' + fmtDate(v('pickup-date')) + (v('pickup-time') ? ' ' + T.at + ' ' + v('pickup-time') : ''));
    lines.push('\u2022 ' + T.ret + SEP + fmtDate(v('return-date')) + (v('return-time') ? ' ' + T.at + ' ' + v('return-time') : ''));
    if (pickupLoc.value === 'airport' && v('flight')) lines.push('\u2022 ' + T.flight + SEP + v('flight'));
    var carSel = document.getElementById('car');
    lines.push('\u2022 ' + T.car + SEP + (carSel && carSel.value ? selectedText(carSel) : T.nopref));
    lines.push('\u2022 ' + T.name + SEP + v('name'));
    lines.push('\u2022 ' + T.wa + SEP + v('whatsapp'));
    if (v('email')) lines.push('\u2022 ' + T.email + SEP + v('email'));
    if (v('notes')) lines.push('\u2022 ' + T.notes + SEP + v('notes'));
    return lines.join('\n');
  }

  function validate() {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      var fieldBox = el.closest('.field');
      var empty = !el.value.trim();
      var hidden = el.closest('.hidden');
      if (empty && !hidden) {
        ok = false;
        if (fieldBox) fieldBox.classList.add('invalid');
        if (!validate.focused) { el.focus(); validate.focused = true; }
      } else if (fieldBox) {
        fieldBox.classList.remove('invalid');
      }
    });
    /* return date must not precede pickup date */
    var from = document.getElementById('pickup-date');
    var to = document.getElementById('return-date');
    if (ok && from && to && from.value && to.value && to.value < from.value) {
      ok = false;
      var box = to.closest('.field');
      if (box) box.classList.add('invalid');
      to.focus();
    }
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    validate.focused = false;
    if (!validate()) return;

    var msg = buildMessage();
    var waUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);

    var confirmBox = document.getElementById('confirm-box');
    var waAgain = document.getElementById('wa-again');
    if (waAgain) waAgain.href = waUrl;
    form.classList.add('hidden');
    if (confirmBox) {
      confirmBox.classList.remove('hidden');
      confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    window.open(waUrl, '_blank', 'noopener');
  });

  var editBtn = document.getElementById('edit-request');
  if (editBtn) {
    editBtn.addEventListener('click', function () {
      document.getElementById('confirm-box').classList.add('hidden');
      form.classList.remove('hidden');
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();
