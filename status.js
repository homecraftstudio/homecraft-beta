/* Schakelaar voor de beta van HomeCraft.

   BETA_OPEN = false  (nu)
     Bezoekers zien "Coming soon" in de gekozen taal, met een link terug naar homecraft.studio.
     Uitzondering: wie een geldige uitnodigingslink heeft (?u=<code>, zie toegang.js) of die eerder
     op dit apparaat gebruikte, ziet gewoon de installatiegids.

   BETA_OPEN = true   (bij de lancering)
     Iedereen gaat zonder code direct naar de installatiegids: de pagina stuurt door naar
     /#installeren. Een ?lang=xx in het adres blijft daarbij behouden.

   De beta openen: zet hieronder false op true, commit en publiceer. Verder hoeft er niets te veranderen;
   uitnodigingscodes blijven gewoon werken. */
const BETA_OPEN = false;
