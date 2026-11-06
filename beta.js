/* Kopieerknop en de rand onder de kop. */
(function () {
  var kop = document.querySelector('.kop');
  if (kop) {
    var bij = function () { kop.classList.toggle('gescrold', window.scrollY > 8); };
    window.addEventListener('scroll', bij, { passive: true });
    bij();
  }

  var knop = document.getElementById('kopieer');
  var status = document.getElementById('kopie-status');
  if (!knop) return;
  // Teksten in de gekozen taal (i18n.js); Engels als terugval.
  var tekst = function (k) {
    var T = window.HC_T || function (s, en) { return en; };
    return { klaar: T('inst.gekopieerd', 'Copied'), mis: T('inst.selecteer', 'Select and copy'), terug: T('inst.kopieer', 'Copy') }[k];
  };
  function selecteer(el) {
    var r = document.createRange(); r.selectNodeContents(el);
    var s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  knop.addEventListener('click', function () {
    var bron = document.querySelector(knop.getAttribute('data-kopieer'));
    var label = knop.querySelector('span');
    var url = bron.textContent.trim();
    var klaar = function () {
      knop.classList.add('gekopieerd'); label.textContent = tekst('klaar'); status.textContent = tekst('klaar');
      setTimeout(function () { knop.classList.remove('gekopieerd'); label.textContent = tekst('terug'); status.textContent = ''; }, 2000);
    };
    var mis = function () { selecteer(bron); label.textContent = tekst('mis'); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(klaar, mis);
    else {
      selecteer(bron);
      try { document.execCommand('copy') ? klaar() : mis(); } catch (e) { mis(); }
    }
  });
})();
