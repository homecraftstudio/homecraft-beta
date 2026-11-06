/* Schakelaar voor de open beta van HomeCraft.

   BETA_OPEN = false  (nu)
     Bezoekers zien "Open beta: coming soon" in de gekozen taal, met een link terug naar homecraft.studio.
     Stille uitzondering voor testers: een geldige code (?u=<code>, zie toegang.js), of een code die
     eerder op dit apparaat is gebruikt, toont gewoon de installatiegids. De pagina noemt dat nergens.

   BETA_OPEN = true   (bij de lancering)
     Iedereen gaat zonder code direct naar de installatiegids: de pagina stuurt door naar
     /#installeren. Een ?lang=xx in het adres blijft daarbij behouden.

   De beta openen: zet hieronder false op true, commit en publiceer. Verder hoeft er niets te veranderen;
   testcodes blijven gewoon werken. */
const BETA_OPEN = false;
