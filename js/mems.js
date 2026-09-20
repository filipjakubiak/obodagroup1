/* ==========================================================================
   MEMS — rozdział flagowy.

   Siedem modułów jako jedna droga, a nie siedem produktów w koszyku.
   Każdy moduł dostaje duże zdjęcie i obok blok z tytułem oraz konkretem:
   trzema pierwszymi korzyściami z opisu. Strony wymieniają się co wiersz,
   żeby siedem pozycji nie czytało się jak siedem razy to samo.

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
   kolorów — to ich system, nigdy niepokazany na stronie. */
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
    const li = el("li", "mems__poz" + (i % 2 ? " mems__poz--odwrotnie" : ""));

    const kadr = el("div", "mems__kadr");
    const img = document.createElement("img");
    img.src = "./assets/mems/" + (OKLADKI[i] || OKLADKI[0]);
    img.alt = "";
    /* Pierwsze dwa moduły są blisko górnej krawędzi sekcji, więc ładują się
       od razu. Reszta leniwie, bo strona ma siedem dużych zdjęć. */
    img.loading = i < 2 ? "eager" : "lazy";
    img.width = 1728;
    img.height = 1608;
    kadr.appendChild(img);

    const tresc = el("div", "mems__tresc");
    tresc.appendChild(el("span", "mems__numer", String(s.mems).padStart(2, "0")));
    /* Numer jest w osobnym elemencie, więc z tytułu go zdejmujemy. */
    tresc.appendChild(el("h3", "mems__tytul", pole(s, "tytul").replace(/^MEMS \d+\.\s*/, "")));

    /* Trzy pierwsze korzyści zamiast jednego zdania. To jest konkret, którego
       człowiek szuka przed decyzją za 2620 zł: nie „o czym jest moduł",
       tylko „co będę po nim umiał". */
    const korzysci = (s.korzysci_pl || []).slice(0, 3);
    if (korzysci.length) {
      const ul = el("ul", "mems__korzysci");
      for (const k of korzysci) ul.appendChild(el("li", "mems__korzysc", k));
      tresc.appendChild(ul);
    } else if (pole(s, "lead")) {
      tresc.appendChild(el("p", "mems__lead", pole(s, "lead")));
    }

    const link = el("a", "mems__link", "Szczegóły modułu");
    link.href = "./szkolenie.html?id=" + encodeURIComponent(s.id);
    tresc.appendChild(link);

    li.append(kadr, tresc);
    lista.appendChild(li);
  });

  host.appendChild(lista);

  /* ---------- jak zapisac sie na caly cykl ----------
     Trzy kwoty bez kontekstu nic nie mowia. Pokazujemy CALY koszt kazdego
     wariantu, roznice wzgledem platnosci jednorazowej i kroki, ktore trzeba
     zrobic. Raty sa drozsze - to jest fakt z ich wlasnego cennika i klient
     ma prawo go zobaczyc przed decyzja, a nie po. */

  const proces = el("section", "proces");
  proces.appendChild(el("h3", "proces__tytul", "Jak zapisać się na cały cykl"));

  const KROKI = [
    ["Wybierasz", "Cały cykl albo pojedyncze moduły. Nie musisz decydować od razu o wszystkich siedmiu."],
    ["Dzwonisz", "Marlena Majewska, 601 370 962. Doradzi, od czego zacząć przy Twojej praktyce."],
    ["Ustalacie termin", "Najbliższy wolny zjazd albo wersja wyjazdowa: cały cykl podczas jednej podróży."],
    ["Faktura", "Wystawiamy fakturę na praktykę. Płatność jednorazowa albo w ratach."],
  ];
  const kroki = el("ol", "proces__kroki");
  KROKI.forEach(([tytul, opis], i) => {
    const li = el("li", "krok");
    li.appendChild(el("span", "krok__numer", String(i + 1)));
    li.appendChild(el("h4", "krok__tytul", tytul));
    li.appendChild(el("p", "krok__opis", opis));
    kroki.appendChild(li);
  });
  proces.appendChild(kroki);
  host.appendChild(proces);

  const ceny = el("section", "ceny");
  ceny.appendChild(el("h3", "ceny__tytul", "Trzy sposoby zapłaty za ten sam komplet"));
  ceny.appendChild(el("p", "ceny__wstep",
    "To nie są trzy różne szkolenia, tylko ten sam komplet siedmiu modułów. Różni się wyłącznie rozłożenie płatności - i koszt końcowy."));

  /* Od najtanszego CALKOWICIE, nie od najnizszej raty: kolejnosc ma
     pomagac w decyzji, a nie sugerowac najnizsza liczbe. */
  const posort = [...warianty_mems].sort((a, b) => a.razem - b.razem);
  const najtanszy = posort[0];

  const siatka = el("ul", "ceny__siatka");
  for (const w of posort) {
    const li = el("li", "ceny__poz" + (w === najtanszy ? " ceny__poz--najtanszy" : ""));

    if (w === najtanszy) li.appendChild(el("span", "ceny__plakietka", "Najtaniej"));

    li.appendChild(el("span", "ceny__ile", w.raty === 1 ? "Płatność jednorazowa" : w.raty + " raty"));

    const kwota = el("span", "ceny__kwota", zlotowki(w.cena));
    li.appendChild(kwota);
    if (w.raty > 1) li.appendChild(el("span", "ceny__zaRate", "za jedną ratę"));

    const razem = el("span", "ceny__razem");
    razem.appendChild(el("span", "ceny__razemEtykieta", "Razem"));
    razem.appendChild(el("span", "ceny__razemKwota", zlotowki(w.razem)));
    li.appendChild(razem);

    const roznica = w.razem - najtanszy.razem;
    li.appendChild(el("span", "ceny__roznica",
      roznica === 0 ? "Najniższy koszt całkowity" : "O " + zlotowki(roznica) + " więcej niż jednorazowo"));

    ceny.appendChild(siatka);
    siatka.appendChild(li);
  }

  ceny.appendChild(el("p", "ceny__uwaga",
    "Ceny za jedną osobę. Przy zgłoszeniu całego zespołu policzymy ofertę indywidualnie."));

  const cta = el("a", "btn btn--gl", "Zapytaj o najbliższy termin");
  cta.href = "./kontakt.html?szkolenie=" + encodeURIComponent(modul[0] ? modul[0].id : "");
  ceny.appendChild(cta);

  host.appendChild(ceny);

  /* Każdy moduł odsłania się osobno, bez kaskady po całej liście: przy
     siedmiu wysokich wierszach kaskada oznaczałaby czekanie na ostatni. */
  ujawnij(lista.querySelectorAll(".mems__poz"), { odstep: 0, prog: 0.22 });
  ujawnij(kroki.querySelectorAll(".krok"), { odstep: 60, prog: 0.3 });
  ujawnij(siatka.querySelectorAll(".ceny__poz"), { odstep: 70, prog: 0.3 });
}
