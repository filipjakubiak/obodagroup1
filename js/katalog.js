/* ==========================================================================
   KATALOG — 35 szkoleń, filtr po roli w gabinecie.

   Stara strona podaje dziewięć płaskich kategorii produktowych i zostawia
   człowieka samego. Tu filtr pyta o to, o co pyta odwiedzający: „dla kogo
   jest to szkolenie", a nie „w której kategorii leży".

   Stan filtra siedzi w adresie (?grupa=lekarz), więc link da się podesłać
   współpracownikowi. Zmiana filtra nie przeładowuje strony, ale wejście
   z linkiem ustawia go od razu.
   ========================================================================== */

import { pobierz, pole, zlotowki } from "./dane.js";
import { ujawnij } from "./ruch.js";

const el = (tag, klasa, tekst) => {
  const n = document.createElement(tag);
  if (klasa) n.className = klasa;
  if (tekst != null) n.textContent = tekst;
  return n;
};

export async function zbudujKatalog(host) {
  if (!host) return;
  const { grupy, szkolenia } = await pobierz("szkolenia");

  const filtr = el("div", "filtr");
  filtr.setAttribute("role", "group");
  filtr.setAttribute("aria-label", "Filtr szkoleń według roli");

  const lista = el("ul", "karty");
  const licznik = el("p", "katalog__licznik");

  /* ---------- karty ---------- */

  const rysuj = (wybrana) => {
    lista.textContent = "";
    const widoczne = szkolenia.filter((s) => !wybrana || s.grupa === wybrana);

    for (const s of widoczne) {
      const g = grupy.find((x) => x.id === s.grupa);
      const li = el("li", `karta pole pole--${g.kolor}`);

      const a = el("a", "karta__link");
      a.href = `./szkolenie.html?id=${encodeURIComponent(s.id)}`;

      a.appendChild(el("span", "karta__grupa", pole(g, "nazwa")));
      a.appendChild(el("span", "karta__tytul", pole(s, "tytul")));
      if (pole(s, "lead")) a.appendChild(el("span", "karta__lead", pole(s, "lead")));

      const stopka = el("span", "karta__stopka");
      stopka.appendChild(el("span", "karta__cena", s.cena > 0 ? zlotowki(s.cena) : "wycena indywidualna"));
      if (s.do_zatwierdzenia) stopka.appendChild(el("span", "znacznik", "opis do uzupełnienia"));
      a.appendChild(stopka);

      li.appendChild(a);
      lista.appendChild(li);
    }

    licznik.textContent = widoczne.length === 1
      ? "1 szkolenie"
      : `${widoczne.length} ${widoczne.length < 5 ? "szkolenia" : "szkoleń"}`;

    ujawnij(lista.querySelectorAll(".karta"), { odstep: 60, prog: 0.12 });
  };

  /* ---------- filtr ---------- */

  const przyciski = [];
  const ustaw = (wybrana, zapisz = true) => {
    przyciski.forEach((b) => {
      const aktywny = (b.dataset.grupa || "") === (wybrana || "");
      b.classList.toggle("is-on", aktywny);
      b.setAttribute("aria-pressed", String(aktywny));
    });
    rysuj(wybrana);
    if (!zapisz) return;
    const u = new URL(location.href);
    if (wybrana) u.searchParams.set("grupa", wybrana);
    else u.searchParams.delete("grupa");
    /* replaceState, nie pushState: filtrowanie to nie nawigacja, a przycisk
       „wstecz" ma wracać na poprzednią stronę, nie odklikiwać filtry. */
    history.replaceState(null, "", u);
  };

  const dodajPrzycisk = (id, etykieta, kolor) => {
    const b = el("button", "filtr__btn" + (kolor ? ` pole pole--${kolor}` : ""), etykieta);
    b.type = "button";
    if (id) b.dataset.grupa = id;
    b.addEventListener("click", () => ustaw(id));
    przyciski.push(b);
    filtr.appendChild(b);
  };

  dodajPrzycisk("", "Wszystkie", null);
  for (const g of grupy) dodajPrzycisk(g.id, pole(g, "nazwa"), g.kolor);

  host.append(filtr, licznik, lista);

  /* Wejście z linkiem ustawia filtr od razu. Nieznana wartość jest ignorowana,
     zamiast pokazywać pustą stronę. */
  const zAdresu = new URL(location.href).searchParams.get("grupa");
  const poprawna = grupy.some((g) => g.id === zAdresu) ? zAdresu : "";
  ustaw(poprawna, false);
}

/* ==========================================================================
   STRONA SZCZEGÓŁU — szkolenie.html?id=...
   ========================================================================== */

export async function zbudujSzkolenie(host) {
  if (!host) return;
  const { grupy, szkolenia } = await pobierz("szkolenia");
  const id = new URL(location.href).searchParams.get("id");
  const s = szkolenia.find((x) => x.id === id);

  /* Nieznany identyfikator dostaje czytelny komunikat i drogę dalej,
     a nie pustą stronę. */
  if (!s) {
    host.appendChild(el("h1", "szkol__tytul", "Nie znaleźliśmy tego szkolenia"));
    host.appendChild(el("p", "lead",
      "Możliwe, że link jest niepełny albo szkolenie zmieniło nazwę. Pełna lista jest w katalogu."));
    const a = el("a", "btn btn--gl", "Wróć do katalogu");
    a.href = "./szkolenia.html";
    host.appendChild(a);
    document.title = "Nie znaleziono szkolenia - Oboda Group";
    return;
  }

  const g = grupy.find((x) => x.id === s.grupa);
  host.classList.add("pole", `pole--${g.kolor}`);
  document.title = `${pole(s, "tytul")} - Oboda Group`;

  const wroc = el("a", "szkol__wroc", "Wszystkie szkolenia");
  wroc.href = `./szkolenia.html?grupa=${g.id}`;
  host.appendChild(wroc);

  host.appendChild(el("p", "szkol__grupa", pole(g, "nazwa")));
  host.appendChild(el("h1", "szkol__tytul", pole(s, "tytul")));

  if (s.do_zatwierdzenia) {
    host.appendChild(el("p", "znacznik", "opis do uzupełnienia przez klienta"));
  }

  if (s.korzysci_pl.length) {
    host.appendChild(el("h2", "szkol__podtytul", "Co z tego wyniesiesz"));
    const ul = el("ul", "szkol__korzysci");
    for (const k of s.korzysci_pl) ul.appendChild(el("li", "szkol__korzysc", k));
    host.appendChild(ul);
  }

  const cena = el("div", "szkol__cena");
  cena.appendChild(el("span", "szkol__kwota", s.cena > 0 ? zlotowki(s.cena) : "Wycena indywidualna"));
  cena.appendChild(el("span", "szkol__uwaga", "Cena za osobę. Terminy i zapisy przez koordynatora."));
  const cta = el("a", "btn btn--gl", "Zapytaj o termin");
  cta.href = `./kontakt.html?szkolenie=${encodeURIComponent(s.id)}`;
  cena.appendChild(cta);
  host.appendChild(cena);
}
