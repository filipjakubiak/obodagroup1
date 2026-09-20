/* Generator podstron.
   Nagłówek i stopka idą STATYCZNIE do każdego pliku, nie przez JavaScript:
   nawigacja musi działać przy wyłączonym JS i to samo widzi wyszukiwarka.
   Ceną jest powielenie znaczników, więc trzymamy je w jednym miejscu tutaj
   i generujemy pliki, zamiast kopiować ręcznie. */

import fs from "node:fs";
import path from "node:path";

const KORZEN = path.resolve(import.meta.dirname, "..");

const STRONY = [
  ["index.html", "Oboda Group"],
  ["mems.html", "MEMS"],
  ["szkolenia.html", "Szkolenia"],
  ["zespol.html", "Zespół"],
  ["wyjazdy.html", "Wyjazdy"],
  ["kontakt.html", "Kontakt"],
];

export function glowa({ tytul, opis, plik, dodatkowe = "" }) {
  const nawigacja = STRONY.slice(1).map(([p, nazwa]) =>
    `      <a class="naglowek__link" href="./${p}"${p === plik ? ' aria-current="page"' : ""}>${nazwa}</a>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${tytul}</title>
<meta name="description" content="${opis}">
<meta property="og:title" content="${tytul}">
<meta property="og:description" content="${opis}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pl_PL">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Geist:wght@400;500;600&display=swap">

<link rel="stylesheet" href="./css/tokens.css">
<link rel="stylesheet" href="./css/base.css">
<link rel="stylesheet" href="./css/uklad.css">
<link rel="stylesheet" href="./css/komponenty.css">
${dodatkowe}</head>
<body>

<a class="skip" href="#tresc">Przejdź do treści</a>

<div class="naglowek naglowek--staly">
  <div class="pas naglowek__pas">
    <a href="./index.html" aria-label="Oboda Group, strona główna">
      <img class="naglowek__logo" src="./assets/marka/logo.webp" alt="Oboda Group" width="452" height="122">
    </a>
    <nav class="naglowek__nawigacja" aria-label="Główna">
${nawigacja}
      <a class="naglowek__jezyk" href="./en/" hreflang="en">EN</a>
    </nav>
  </div>
</div>
`;
}

export const stopka = `
<footer class="stopka">
  <div class="pas stopka__pas">
    <div class="stopka__blok">
      <p class="stopka__nazwa">Mariusz Oboda<br>Consulting &amp; Training Group</p>
      <p class="stopka__adres">ul. Kazimierza Wielkiego 5C/159<br>61-863 Poznań<br>NIP 778-104-09-65</p>
    </div>
    <div class="stopka__blok">
      <p class="stopka__naglowek">Kontakt</p>
      <p><a href="mailto:biuro@oboda.pl">biuro@oboda.pl</a></p>
      <p><a href="tel:+48601370962">601 370 962</a> Marlena Majewska</p>
      <p><a href="tel:+48662082800">662 082 800</a> Lidia Kaźmierczak</p>
      <p><a href="tel:+48660619099">660 619 099</a> Adrian Majewski</p>
    </div>
    <div class="stopka__blok">
      <p class="stopka__naglowek">Więcej</p>
      <p><a href="https://www.facebook.com/obodagroup" rel="noopener">Facebook</a></p>
      <p><a href="https://www.instagram.com/obodagroup" rel="noopener">Instagram</a></p>
      <p><a href="./polityka-prywatnosci.html">Polityka prywatności</a></p>
    </div>
  </div>
</footer>
`;

const zapisz = (plik, tresc) => {
  fs.writeFileSync(path.join(KORZEN, plik), tresc, "utf8");
  console.log("  " + plik);
};

/* ---------- MEMS ---------- */

zapisz("mems.html", glowa({
  plik: "mems.html",
  tytul: "MEMS - autorski cykl Oboda Group",
  opis: "Siedem dwudniowych modułów o psychologii pracy z pacjentem. Autorski standard, który stanowi kanon zawodowego profesjonalizmu lekarza.",
}) + `
<main id="tresc">
  <section class="mems pole pole--ogien">
    <div class="pas">
      <p class="mems__etykieta">Multilevel Engagement &amp; Motivation Strategy</p>
      <h1 class="mems__naglowek">MEMS</h1>
      <p class="lead mems__wstep">
        Siedem dwudniowych modułów, po których lekarz przestaje tłumaczyć plan
        leczenia, a zaczyna rozmawiać o tym, na czym pacjentowi zależy.
        Standard, który stanowi dziś kanon zawodowego profesjonalizmu lekarza.
      </p>
    </div>
    <div class="pas" id="memsTresc"></div>
  </section>

  <section class="dowod">
    <div class="pas">
      <h2 class="dowod__tytul">Dla kogo</h2>
      <p class="lead dowod__wstep">
        Dla lekarza dentysty, który ma pełen grafik, a mimo to widzi, że
        pacjenci odkładają leczenie, o którym rozmawiali w gabinecie.
        Cykl można odbyć w Polsce albo w całości podczas jednego
        <a href="./wyjazdy.html">wyjazdu szkoleniowego</a>.
      </p>
    </div>
  </section>
</main>
${stopka}
<script type="module">
  import { zbudujMems } from "./js/mems.js";
  document.documentElement.classList.add("js");
  zbudujMems(document.getElementById("memsTresc"));
</script>

</body>
</html>
`);

/* ---------- ZESPÓŁ ---------- */

zapisz("zespol.html", glowa({
  plik: "zespol.html",
  tytul: "Zespół - Oboda Group",
  opis: "Mariusz Oboda, dr Adrian Majewski, Marlena Majewska, Lidia Kaźmierczak. Kto prowadzi szkolenia i kto umawia terminy.",
}) + `
<main id="tresc">
  <section class="zespol">
    <div class="pas">
      <h1 class="katalog__tytul">Zespół</h1>
      <p class="lead katalog__wstep">
        Czworo ludzi. Jeden prowadzi szkolenia, jeden liczy rentowność
        gabinetu, dwoje doprowadza do tego, żeby wszystko się odbyło.
      </p>
    </div>
    <div class="pas" id="zespolTresc"></div>
  </section>
</main>
${stopka}
<script type="module">
  import { zbudujZespol } from "./js/strony.js";
  document.documentElement.classList.add("js");
  zbudujZespol(document.getElementById("zespolTresc"));
</script>

</body>
</html>
`);

/* ---------- WYJAZDY ---------- */

zapisz("wyjazdy.html", glowa({
  plik: "wyjazdy.html",
  tytul: "Wyjazdy szkoleniowe - Oboda Group",
  opis: "Sri Lanka, Malta, Zanzibar, Dominikana, Indie. Pełny cykl MEMS podczas jednej podróży zamiast siedmiu wyjazdów do Poznania.",
}) + `
<main id="tresc">
  <section class="wyjazdy">
    <div class="pas">
      <h1 class="katalog__tytul">Wyjazdy</h1>
      <p class="lead katalog__wstep">
        Cykl, który w Polsce zajmuje siedem dwudniowych zjazdów, da się odbyć
        podczas jednej podróży. Byliśmy z tym na Sri Lance, Malcie, Zanzibarze,
        Dominikanie i w Indiach.
      </p>
    </div>
    <div class="pas" id="wyjazdyTresc"></div>
  </section>
</main>
${stopka}
<script type="module">
  import { zbudujWyjazdy } from "./js/strony.js";
  document.documentElement.classList.add("js");
  zbudujWyjazdy(document.getElementById("wyjazdyTresc"));
</script>

</body>
</html>
`);

/* ---------- KONTAKT ---------- */

zapisz("kontakt.html", glowa({
  plik: "kontakt.html",
  tytul: "Kontakt - Oboda Group",
  opis: "Mariusz Oboda Consulting & Training Group, Poznań. Telefony do koordynatorów szkoleń i formularz zapytania.",
}) + `
<main id="tresc">
  <section class="kontakt">
    <div class="pas">
      <h1 class="katalog__tytul">Kontakt</h1>
      <p class="lead katalog__wstep">
        Najszybciej odpowiemy telefonicznie. Jeśli nie wiesz, do kogo
        zadzwonić, napisz na biuro@oboda.pl, a przekierujemy.
      </p>
    </div>
    <div class="pas" id="kontaktTresc"></div>
  </section>
</main>
${stopka}
<script type="module">
  import { zbudujKontakt } from "./js/strony.js";
  document.documentElement.classList.add("js");
  zbudujKontakt(document.getElementById("kontaktTresc"));
</script>

</body>
</html>
`);

console.log("\nstrony wygenerowane");

/* ---------- KATALOG i SZCZEGÓŁ ---------- */

zapisz("szkolenia.html", glowa({
  plik: "szkolenia.html",
  tytul: "Szkolenia - Oboda Group",
  opis: "35 szkoleń dla praktyki stomatologicznej, ułożonych według ról w gabinecie: lekarz, przy pacjencie, pierwszy kontakt, zarządzanie, cały zespół.",
}) + `
<main id="tresc">
  <section class="katalog">
    <div class="pas">
      <h1 class="katalog__tytul">Szkolenia</h1>
      <p class="lead katalog__wstep">
        Ułożone według ról w gabinecie, nie według kategorii w cenniku.
        Zacznij od tego, kogo chcesz rozwinąć.
      </p>
    </div>
    <div class="pas" id="katalogTresc"></div>
  </section>
</main>
${stopka}
<script type="module">
  import { zbudujKatalog } from "./js/katalog.js";
  document.documentElement.classList.add("js");
  zbudujKatalog(document.getElementById("katalogTresc"));
</script>

</body>
</html>
`);

zapisz("szkolenie.html", glowa({
  plik: "szkolenia.html",
  tytul: "Szkolenie - Oboda Group",
  opis: "Szczegóły szkolenia Oboda Group: program, efekty, cena i kontakt do koordynatora.",
  /* Tresc powstaje po stronie przegladarki z parametru ?id=, wiec nie ma
     czego indeksowac - katalog jest stroną, która ma się wyświetlać w wynikach. */
  dodatkowe: `<meta name="robots" content="noindex">\n`,
}) + `
<main id="tresc">
  <section class="szkol" id="szkolTresc">
    <div class="pas">
      <noscript><p class="lead">Ta strona wymaga JavaScriptu. Pełna lista szkoleń jest w <a href="./szkolenia.html">katalogu</a>.</p></noscript>
    </div>
  </section>
</main>
${stopka}
<script type="module">
  import { zbudujSzkolenie } from "./js/katalog.js";
  document.documentElement.classList.add("js");
  zbudujSzkolenie(document.querySelector("#szkolTresc .pas"));
</script>

</body>
</html>
`);

/* ---------- POLITYKA PRYWATNOŚCI ----------
   Treść przepisana ze starej strony bez zmiany sensu. ⚠️ Dokument opisuje
   infrastrukturę WordPressa i wymaga aktualizacji pod nową - to zadanie
   prawnika klienta, nie nasze. Mówimy o tym wprost na stronie. */

const politykaZrodlo = fs.readFileSync(path.join(KORZEN, "_scrape/polityka.html"), "utf8");
const politykaTresc = politykaZrodlo
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/\sclass="[^"]*"/g, "")
  .replace(/\sstyle="[^"]*"/g, "")
  .replace(/\s*[–—]\s*/g, " - ")
  .replace(/&#8211;|&ndash;|&mdash;/g, "-")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

zapisz("polityka-prywatnosci.html", glowa({
  plik: "",
  tytul: "Polityka prywatności - Oboda Group",
  opis: "Zasady przetwarzania danych osobowych w serwisie Oboda Group.",
  dodatkowe: `<meta name="robots" content="noindex">\n`,
}) + `
<main id="tresc">
  <section class="tekst">
    <div class="pas">
      <h1 class="katalog__tytul">Polityka prywatności</h1>
      <p class="uwaga-prawna">
        Dokument przeniesiony z poprzedniej wersji serwisu. Opisuje
        infrastrukturę starej strony i <strong>wymaga aktualizacji przez prawnika</strong>
        przed uruchomieniem nowego serwisu.
      </p>
      <div class="tekst__tresc">
${politykaTresc}
      </div>
    </div>
  </section>
</main>
${stopka}

</body>
</html>
`);
