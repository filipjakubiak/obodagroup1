/* ==========================================================================
   MEMS — rozdział flagowy.

   Siedem modułów jako jedna droga, a nie siedem produktów w koszyku.
   Na dole warianty płatności za CAŁY cykl: w WooCommerce leżały obok
   szkoleń jako trzy osobne pozycje i wyglądały jak trzy kolejne kursy.
   ========================================================================== */

import { pobierz, pole, zlotowki } from "./dane.js";
import { ujawnij } from "./ruch.js";

const el = (tag, klasa, tekst) => {
  const n = document.createElement(tag);
  if (klasa) n.className = klasa;
  if (tekst != null) n.textContent = tekst;
  return n;
};

/* Okładki modułów pochodzą z ich własnych materiałów. Każda ma inną parę
   kolorów - to ich system, nigdy niepokazany na stronie. */
const OKLADKI = [
  "psychologia-motywacji-cover.webp",
  "psychologia-motywacji.webp",
  "emocje-cover.webp",
  "kolorowe-ja-cover.webp",
  "przekonania-cover.webp",
  "przywodztwo-cover.webp",
  "szkolenia-certyfikacyjne-cover.webp",
];

export async function zbudujMems(host) {
  if (!host) return;
  const { szkolenia, warianty_mems } = await pobierz("szkolenia");
  const modul = szkolenia.filter((s) => s.mems).sort((a, b) => a.mems - b.mems);

  /* ---------- siedem modułów ---------- */
  const lista = el("ol", "mems__lista");
  modul.forEach((s, i) => {
    const li = el("li", "mems__poz");

    const numer = el("span", "mems__numer", String(s.mems).padStart(2, "0"));

    const kadr = el("span", "mems__kadr");
    const img = document.createElement("img");
    img.src = `./assets/mems/${OKLADKI[i] || OKLADKI[0]}`;
    img.alt = "";
    img.loading = "lazy";
    img.width = 1728;
    img.height = 1608;
    kadr.appendChild(img);

    const tresc = el("span", "mems__tresc");
    /* Numer jest już w osobnej kolumnie, więc z tytułu go zdejmujemy. */
    tresc.appendChild(el("span", "mems__tytul", pole(s, "tytul").replace(/^MEMS \d+\.\s*/, "")));
    tresc.appendChild(el("span", "mems__lead", pole(s, "lead")));

    li.append(numer, kadr, tresc);
    lista.appendChild(li);
  });
  host.appendChild(lista);

  /* ---------- warianty płatności ---------- */
  const ceny = el("div", "ceny");
  ceny.appendChild(el("h3", "ceny__tytul", "Cały cykl, trzy sposoby zapłaty"));
  ceny.appendChild(el("p", "ceny__wstep",
    "To nie są trzy różne szkolenia, tylko ten sam komplet siedmiu modułów. Różni się wyłącznie rozłożenie płatności."));

  const siatka = el("ul", "ceny__siatka");
  /* Od najtaniej rozłożonego do jednorazowego: człowiek czyta od lewej,
     więc najpierw pokazujemy najniższą kwotę do zapłaty teraz. */
  const posort = [...warianty_mems].sort((a, b) => a.cena - b.cena);
  for (const w of posort) {
    const li = el("li", "ceny__poz");
    li.appendChild(el("span", "ceny__nazwa", pole(w, "nazwa").replace(/^Mems - cały projekt - /i, "")));
    li.appendChild(el("span", "ceny__kwota", zlotowki(w.cena)));
    siatka.appendChild(li);
  }
  ceny.appendChild(siatka);
  host.appendChild(ceny);

  ujawnij(lista.querySelectorAll(".mems__poz"), { odstep: 90, prog: 0.3 });
}
