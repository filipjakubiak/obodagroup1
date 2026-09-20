/* Przepisanie WooCommerce -> nasz model treści.
   Uruchamiane ręcznie, wynik ląduje w data/*.json i idzie do repozytorium —
   strona nie odpytuje starego WordPressa.

   Dwie rzeczy, które ten skrypt musi zrobić dobrze:
   1. Mapa kategorii jest JAWNA i PEŁNA. Produkt spoza mapy wywala skrypt,
      zamiast po cichu zniknąć z katalogu.
   2. Myślnik i półpauza są konwertowane na dywiz. Tytuły z WooCommerce są ich
      pełne ("rejestratorka cz. 1 – rozmowa telefoniczna"), a w treści strony
      są zakazane. */

import fs from "node:fs";
import path from "node:path";

const KORZEN = path.resolve(import.meta.dirname, "..");
const zrodlo = JSON.parse(fs.readFileSync(path.join(KORZEN, "_scrape/products.json"), "utf8"));

/* ---------- mapa kategorii -> pięć grup rolowych ----------
   Stare kategorie są produktowe. Nowe są rolami w gabinecie, bo tak myśli
   człowiek, który wchodzi na stronę: "czego potrzebuje moja rejestratorka",
   nie "pokaż kategorię numer siedem". */
const MAPA = {
  "MEMS": "lekarz",
  "Profesjonalna asystentka": "pacjent",
  "Profesjonalna higienistka": "pacjent",
  "Opiekun pacjenta": "pacjent",
  "Profesjonalna rejestratorka": "kontakt",
  "Tajemniczy pacjent": "kontakt",
  "Akademia Zarządzania": "zarzad",
  "Ekonomia gabinetu": "zarzad",
  "Szkolenia dla całej praktyki": "zespol",
};

/* Sześć pozycji nie ma w WooCommerce żadnej kategorii. Przypisane ręcznie
   po przeczytaniu opisów; trzy ostatnie to nie szkolenia, tylko warianty
   płatności za cały cykl MEMS. */
const BEZ_KATEGORII = {
  "KOLOROWE JA dla zaawansowanych": "lekarz",
  "Profesjonalny model rozmowy z pacjentem ORTOdontycznym": "lekarz",
  "Efektywność działania: pewność siebie, odporność i wrażliwość wg Oboda Group": "lekarz",
  "Mems - cały projekt - płatność jednorazowa": "WARIANT",
  "Mems - cały projekt - płatność w dwóch ratach": "WARIANT",
  "Mems - cały projekt - płatność w trzech ratach": "WARIANT",
};

/* ---------- czyszczenie tekstu ---------- */

const ENCJE = {
  "&#8211;": "-", "&#8212;": "-", "&ndash;": "-", "&mdash;": "-",
  "&#8217;": "'", "&rsquo;": "'", "&#8220;": "„", "&#8221;": "”",
  "&nbsp;": " ", "&amp;": "&", "&quot;": '"', "&lt;": "<", "&gt;": ">",
  "&hellip;": "...", "&#8230;": "...",
};

function odkoduj(t) {
  let s = String(t);
  for (const [e, z] of Object.entries(ENCJE)) s = s.split(e).join(z);
  s = s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
  /* Zakaz myślnika i półpauzy w treści widocznej dla użytkownika.
     Zamieniamy na dywiz otoczony spacjami, żeby zdanie dalej się czytało. */
  s = s.replace(/\s*[–—]\s*/g, " - ");
  return s.replace(/\s+/g, " ").trim();
}

const bezZnacznikow = (t) => odkoduj(String(t).replace(/<[^>]+>/g, " "));

/* Opisy w WooCommerce to listy <li> z efektami szkolenia ("Dowiesz się...",
   "Poznasz..."). Trzymamy je jako tablicę, nie zlepiamy w prozę - to jest
   najlepszy materiał, jaki mamy, i chcemy go pokazać jako listę korzyści. */
function korzysci(html) {
  const li = [...String(html).matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((m) => bezZnacznikow(m[1]))
    .filter((t) => t.length > 12);
  if (li.length) return li;
  /* Brak listy - tniemy prozę na zdania. */
  return bezZnacznikow(html).split(/(?<=[.!?])\s+/).map((z) => z.trim()).filter((z) => z.length > 25);
}

const slug = (t) => odkoduj(t).toLowerCase()
  .replace(/ą/g, "a").replace(/ć/g, "c").replace(/ę/g, "e").replace(/ł/g, "l")
  .replace(/ń/g, "n").replace(/ó/g, "o").replace(/ś/g, "s").replace(/[źż]/g, "z")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/* ---------- grupy ---------- */

const GRUPY = [
  { id: "lekarz", nazwa_pl: "Lekarz", nazwa_en: "", kolor: "ogien", zmienna: "--ogien",
    haslo_pl: "Ty przy fotelu",
    opis_pl: "Motywacja pacjenta do leczenia, komunikacja, przekonania, przywództwo. Rdzeń metody: cykl MEMS." },
  { id: "pacjent", nazwa_pl: "Przy pacjencie", nazwa_en: "", kolor: "ziemia", zmienna: "--ziemia",
    haslo_pl: "Asystentka, higienistka, opiekun",
    opis_pl: "Ludzie w bezpośrednim kontakcie z pacjentem. Struktura wizyty, charyzma, praca z emocjami." },
  { id: "kontakt", nazwa_pl: "Pierwszy kontakt", nazwa_en: "", kolor: "slonce", zmienna: "--slonce",
    haslo_pl: "Rejestracja i telefon",
    opis_pl: "Pierwsze trzydzieści sekund decyduje o tym, czy pacjent umówi wizytę. I czy na nią przyjdzie." },
  { id: "zarzad", nazwa_pl: "Zarządzanie", nazwa_en: "", kolor: "chlod", zmienna: "--chlod",
    haslo_pl: "Właściciel i menedżer",
    opis_pl: "Procesy, rekrutacja, rentowność. Praktyka jako firma, nie jako gabinet z kalendarzem." },
  { id: "zespol", nazwa_pl: "Cały zespół", nazwa_en: "", kolor: "ink", zmienna: "--ink",
    haslo_pl: "Gabinet jako jeden organizm",
    opis_pl: "Szkolenia, na których wszystkie role spotykają się przy jednym stole i ustalają wspólny standard." },
];

/* ---------- przepisanie ---------- */

const szkolenia = [];
const warianty = [];
const nieznane = [];

for (const p of zrodlo) {
  const tytul = bezZnacznikow(p.name);
  const kat = (p.categories || []).map((c) => c.name).filter((n) => n !== "Bez kategorii");
  let grupa = null;

  for (const k of kat) {
    if (MAPA[k]) { grupa = MAPA[k]; break; }
  }
  if (!grupa) grupa = BEZ_KATEGORII[tytul] || null;

  if (!grupa) { nieznane.push({ tytul, kategorie: kat }); continue; }

  const cena = Math.round(Number(p.prices?.price || 0) / 100);

  if (grupa === "WARIANT") {
    warianty.push({ id: slug(tytul), nazwa_pl: tytul, nazwa_en: "", cena, waluta: "PLN" });
    continue;
  }

  const lista = korzysci(p.description || p.short_description || "");
  szkolenia.push({
    id: slug(tytul),
    grupa,
    tytul_pl: tytul,
    tytul_en: "",
    lead_pl: lista[0] || "",
    lead_en: "",
    korzysci_pl: lista,
    korzysci_en: [],
    cena,
    waluta: "PLN",
    /* Jedyne szkolenie bez opisu w WooCommerce. Nie zmyślamy treści -
       oznaczamy i prosimy klienta. */
    do_zatwierdzenia: lista.length === 0,
  });
}

if (nieznane.length) {
  console.error("PRODUKTY SPOZA MAPY - uzupelnij MAPA albo BEZ_KATEGORII:");
  nieznane.forEach((n) => console.error("  " + n.tytul + "  [" + n.kategorie.join(", ") + "]"));
  process.exitCode = 1;
  throw new Error("mapa kategorii jest niepelna (" + nieznane.length + " pozycji)");
}

/* MEMS ma naturalną kolejność 1-7, której nie da się wyczytać z WooCommerce.
   Podajemy ją wprost; reszta grup sortuje się alfabetycznie. */
const KOLEJNOSC_MEMS = [
  "psychologia-motywacji-do-leczenia-cz-1",
  "psychologia-motywacji-do-leczenia-cz-2",
  "inteligencja-komunikacji",
  "kolorowe-ja",
  "przekonania",
  "przywodztwo",
  "integracja-modelu-pracy-z-pacjentem",
];
szkolenia.forEach((s) => {
  const i = KOLEJNOSC_MEMS.indexOf(s.id);
  s.mems = i >= 0 ? i + 1 : null;
  if (s.mems) s.tytul_pl = "MEMS " + s.mems + ". " + s.tytul_pl;
});
szkolenia.sort((a, b) => {
  if (a.grupa !== b.grupa) return GRUPY.findIndex((g) => g.id === a.grupa) - GRUPY.findIndex((g) => g.id === b.grupa);
  if (a.mems || b.mems) return (a.mems || 99) - (b.mems || 99);
  return a.tytul_pl.localeCompare(b.tytul_pl, "pl");
});

const zapisz = (nazwa, dane) => {
  fs.writeFileSync(path.join(KORZEN, "data", nazwa + ".json"), JSON.stringify(dane, null, 2) + "\n", "utf8");
  console.log("  zapisano data/" + nazwa + ".json");
};

zapisz("szkolenia", { grupy: GRUPY, szkolenia, warianty_mems: warianty });

console.log("\nszkolen: " + szkolenia.length + ", wariantow platnosci: " + warianty.length);
for (const g of GRUPY) {
  console.log("  " + g.id.padEnd(9) + String(szkolenia.filter((s) => s.grupa === g.id).length).padStart(3));
}
const bezOpisu = szkolenia.filter((s) => s.do_zatwierdzenia);
if (bezOpisu.length) console.log("do uzupelnienia przez klienta: " + bezOpisu.map((s) => s.tytul_pl).join(", "));
