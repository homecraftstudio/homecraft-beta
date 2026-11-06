#!/usr/bin/env node
// Maakt een nieuwe uitnodigingscode voor de beta en zet de SHA-256 ervan in toegang.js.
// De code zelf komt nooit in de repo: alleen de hash.
//
//   node tools/maak-code.mjs                 nieuwe code, zonder omschrijving
//   node tools/maak-code.mjs "groep najaar"  nieuwe code met een korte omschrijving (geen namen!)
//   node tools/maak-code.mjs --controleer <code>   kijkt of een code geldig is
//   node tools/maak-code.mjs --intrekken <code>    haalt de hash van een code uit de lijst
//
// Daarna toegang.js committen en pushen; de nieuwe link werkt zodra de site is bijgewerkt.
import { createHash, randomInt } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BESTAND = join(dirname(fileURLToPath(import.meta.url)), '..', 'toegang.js');
const ZOUT = 'homecraft-beta:'; // moet gelijk zijn aan ZOUT in toegang.js
const BASIS = 'https://beta.homecraft.studio/?u=';
const TEKENS = 'abcdefghjkmnpqrstuvwxyz23456789'; // zonder 0/o, 1/l/i

const hash = (code) => createHash('sha256').update(ZOUT + code.trim().toLowerCase()).digest('hex');

function nieuweCode() {
  const blok = () => Array.from({ length: 4 }, () => TEKENS[randomInt(TEKENS.length)]).join('');
  return `hc-${blok()}-${blok()}-${blok()}`;
}

const BEGIN = '// BEGIN HASHES';
const EINDE = '// EINDE HASHES';

function leesBlok() {
  const tekst = readFileSync(BESTAND, 'utf8');
  const a = tekst.indexOf(BEGIN), b = tekst.indexOf(EINDE);
  if (a < 0 || b < a) throw new Error('Markeringen BEGIN/EINDE HASHES niet gevonden in toegang.js');
  return { tekst, a: a + BEGIN.length, b };
}

function schrijfRegels(regels) {
  const { tekst, a, b } = leesBlok();
  const blok = '\n  window.HC_BETA_HASHES = [\n' + regels.map((r) => '    ' + r + '\n').join('') + '  ];\n  ';
  writeFileSync(BESTAND, tekst.slice(0, a) + blok + tekst.slice(b));
}

function huidigeRegels() {
  const { tekst, a, b } = leesBlok();
  return tekst.slice(a, b).split('\n').map((r) => r.trim()).filter((r) => /^'[0-9a-f]{64}'/.test(r));
}

const [optie, waarde] = process.argv.slice(2);

if (optie === '--controleer' || optie === '--intrekken') {
  if (!waarde) { console.error('Geef de code mee.'); process.exit(1); }
  const h = hash(waarde);
  const regels = huidigeRegels();
  const gevonden = regels.some((r) => r.startsWith(`'${h}'`));
  if (optie === '--controleer') {
    console.log(gevonden ? 'Geldig: deze code staat in de lijst.' : 'Ongeldig: deze code staat niet in de lijst.');
    process.exit(gevonden ? 0 : 2);
  }
  if (!gevonden) { console.log('Deze code stond niet in de lijst; niets gewijzigd.'); process.exit(0); }
  schrijfRegels(regels.filter((r) => !r.startsWith(`'${h}'`)));
  console.log('Ingetrokken. Commit en push toegang.js om de link uit te zetten.');
  process.exit(0);
}

const omschrijving = (optie || '').replace(/[^\p{L}\p{N} ._-]/gu, '').slice(0, 40);
const code = nieuweCode();
const regels = huidigeRegels();
regels.push(`'${hash(code)}',` + (omschrijving ? ` // ${omschrijving}` : ''));
// laatste komma mag blijven staan: geldige JavaScript
schrijfRegels(regels);

console.log('Nieuwe uitnodigingscode:', code);
console.log('Uitnodigingslink:       ', BASIS + code);
console.log('De hash staat nu in toegang.js. Commit en push om de link te laten werken.');
