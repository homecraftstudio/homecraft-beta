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
  var tekst = function (k) {
    var en = document.documentElement.lang === 'en';
    return { klaar: en ? 'Copied' : 'Gekopieerd', mis: en ? 'Select and copy' : 'Selecteer en kopieer', terug: en ? 'Copy' : 'Kopiëren' }[k];
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
