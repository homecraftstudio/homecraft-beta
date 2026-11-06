/* Taalkeuze NL/EN. Nederlands staat in de HTML; de Engelse teksten staan in teksten-en.js.
   Keuze: ?lang=nl|en, anders een eerder gekozen taal, anders de browsertaal. */
(function () {
  var NL = {}; // originele Nederlandse teksten, bewaard bij de eerste wissel
  var SOORTEN = [
    ['data-i18n', function (el) { return el.textContent; }, function (el, v) { el.textContent = v; }],
    ['data-i18n-html', function (el) { return el.innerHTML; }, function (el, v) { el.innerHTML = v; }],
    ['data-i18n-alt', function (el) { return el.alt; }, function (el, v) { el.alt = v; }],
    ['data-i18n-aria', function (el) { return el.getAttribute('aria-label'); }, function (el, v) { el.setAttribute('aria-label', v); }],
    ['data-i18n-content', function (el) { return el.content; }, function (el, v) { el.content = v; }]
  ];

  function lees(sleutel) { try { return localStorage.getItem(sleutel); } catch (e) { return null; } }
  function bewaar(sleutel, w) { try { localStorage.setItem(sleutel, w); } catch (e) { /* privévenster */ } }

  function zet(taal) {
    var en = window.HC_I18N_EN || {};
    SOORTEN.forEach(function (s) {
      document.querySelectorAll('[' + s[0] + ']').forEach(function (el) {
        var k = el.getAttribute(s[0]);
        var id = s[0] + '|' + k;
        if (!(id in NL)) NL[id] = s[1](el);
        var v = taal === 'en' ? en[k] : NL[id];
        if (v != null) s[2](el, v);
      });
    });
    document.documentElement.lang = taal;
    document.querySelectorAll('[data-taal]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-taal') === taal));
    });
    document.dispatchEvent(new CustomEvent('hc-taal', { detail: taal }));
  }

  function begin() {
    var q = new URLSearchParams(location.search).get('lang');
    var taal = (q === 'nl' || q === 'en') ? q : lees('hc-taal');
    if (taal !== 'nl' && taal !== 'en') {
      var talen = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
      taal = /^nl\b/i.test(talen[0] || '') ? 'nl' : 'en';
      for (var i = 0; i < talen.length; i++) { if (/^(nl|en)\b/i.test(talen[i])) { taal = talen[i].slice(0, 2).toLowerCase(); break; } }
    }
    if (taal !== 'nl') zet(taal);
    document.querySelectorAll('[data-taal]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = b.getAttribute('data-taal');
        bewaar('hc-taal', t);
        zet(t);
      });
    });
    window.HC_TAAL = function () { return document.documentElement.lang; };
  }
  begin();
})();
