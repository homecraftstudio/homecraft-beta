/* Stille testtoegang tot de installatiegids via ?u=<code>, zolang de open beta nog niet open is.
   De pagina noemt dit nergens; een ongeldige code geeft gewoon "Coming soon".
   Dit is een lichte drempel, geen beveiliging: de pagina is statisch. In de bron staan alleen
   SHA-256-hashes, nooit de codes zelf. Nieuwe code: node tools/maak-code.mjs
   Of de beta voor iedereen open is, staat in status.js (BETA_OPEN). Staat hij open, dan gaat elke
   bezoeker naar de installatiegids op /#installeren; anders zien bezoekers zonder geldige code "Coming soon". */
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
      (window.HC_TELQ = window.HC_TELQ || []).push('beta-gids'); // anonieme telling, zie teller.js
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

  var BETA_IS_OPEN = typeof BETA_OPEN !== 'undefined' && BETA_OPEN === true;
  var GIDS = '#installeren';

  /* Beta open: iedereen naar de installatiegids (/#installeren), ?lang en andere parameters blijven staan. */
  if (BETA_IS_OPEN) {
    if (code) zonderCode();
    toon('welkom');
    if (location.pathname !== '/' || location.hash !== GIDS) location.replace('/' + location.search + GIDS);
    return;
  }

  if (!window.crypto || !crypto.subtle) { toon('dicht'); return; }

  if (code) {
    sha256(ZOUT + code).then(function (h) {
      if (lijst.indexOf(h) >= 0) { bewaar(h); zonderCode(); (window.HC_TELQ = window.HC_TELQ || []).push('beta-code'); toon('welkom'); }
      else {
        var opgeslagen = lees();
        if (opgeslagen && lijst.indexOf(opgeslagen) >= 0) { zonderCode(); toon('welkom'); }
        else { zonderCode(); toon('dicht'); } // ongeldige code: stil, gewoon Coming soon
      }
    });
  } else {
    var h = lees();
    if (h && lijst.indexOf(h) >= 0) toon('welkom');
    else { if (h) wis(); toon('dicht'); }
  }
})();
