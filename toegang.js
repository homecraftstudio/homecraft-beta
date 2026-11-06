/* Toegang tot de beta via een uitnodigingslink (?u=<code>).
   Dit is een lichte drempel, geen beveiliging: de pagina is statisch. In de bron staan alleen
   SHA-256-hashes, nooit de codes zelf. Nieuwe code: node tools/maak-code.mjs */
(function () {
  // BEGIN HASHES
  window.HC_BETA_HASHES = [
    '0f91ef34cc366cb8895cd92f44bf1a0b1faed90f45302992df560071d925779b', // groep beta
  ];
  // EINDE HASHES

  var ZOUT = 'homecraft-beta:'; // moet gelijk zijn aan ZOUT in tools/maak-code.mjs
  var OPSLAG = 'hc-beta';

  function lees() { try { return localStorage.getItem(OPSLAG); } catch (e) { return null; } }
  function bewaar(w) { try { localStorage.setItem(OPSLAG, w); } catch (e) { /* privévenster */ } }
  function wis() { try { localStorage.removeItem(OPSLAG); } catch (e) { /* niets */ } }

  function sha256(tekst) {
    var data = new TextEncoder().encode(tekst);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  function toon(staat) {
    document.documentElement.setAttribute('data-toegang', staat);
    document.querySelectorAll('[data-staat]').forEach(function (el) {
      el.hidden = el.getAttribute('data-staat').split(' ').indexOf(staat) < 0;
    });
    if (staat === 'welkom') {
      document.querySelectorAll('[data-alleen-welkom]').forEach(function (el) { el.hidden = false; });
    }
  }

  var lijst = window.HC_BETA_HASHES || [];
  var url = new URL(location.href);
  var code = (url.searchParams.get('u') || '').trim().toLowerCase();

  function zonderCode() {
    url.searchParams.delete('u');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  if (!window.crypto || !crypto.subtle) { toon('dicht'); return; }

  if (code) {
    sha256(ZOUT + code).then(function (h) {
      if (lijst.indexOf(h) >= 0) { bewaar(h); zonderCode(); toon('welkom'); }
      else {
        var opgeslagen = lees();
        if (opgeslagen && lijst.indexOf(opgeslagen) >= 0) { zonderCode(); toon('welkom'); }
        else { toon('ongeldig'); }
      }
    });
  } else {
    var h = lees();
    if (h && lijst.indexOf(h) >= 0) toon('welkom');
    else { if (h) wis(); toon('dicht'); }
  }
})();
