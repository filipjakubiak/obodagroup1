/* ==========================================================================
   DOWÓD — liczby, opinie, logotypy klinik.

   Stara strona ma wszystkie te liczby schowane w jednym zdaniu w środku
   akapitu, a zaproszenie „zobacz opinie" prowadzi donikąd, bo opinii nie ma.
   Ta sekcja robi z tego pierwszy argument, zaraz po hero.
   ========================================================================== */

import { pobierz, pole } from "./dane.js";
import { ujawnijZRozmyciem } from "./ruch.js";

const el = (tag, klasa, tekst) => {
  const n = document.createElement(tag);
  if (klasa) n.className = klasa;
  if (tekst != null) n.textContent = tekst;
  return n;
};

const liczbaPl = (n) => new Intl.NumberFormat("pl-PL").format(n);

export async function zbudujDowod(host) {
  if (!host) return;
  const [ustawienia, dane] = await Promise.all([pobierz("ustawienia"), pobierz("opinie")]);

  /* ---------- liczby: bento ----------
     Piec rownych kolumn czytalo sie jak wiersz tabeli i najdluzsza wartosc
     wchodzila na sasiednia. Tu jedna komorka jest duza i niesie zdjecie,
     reszta siedzi wokol niej w kolorach rol. Siatka 4 x 2 miesci dokladnie
     piec pozycji - zadnej pustej komorki na koncu. */
  /* Kolor po wartosci, nie po indeksie: kolejnosc renderowania zmienila sie
     przez przeniesienie duzej komorki na poczatek. */
  const KOLOR_DLA = { 400: "ogien", 2000: "slonce", 17000: "kwas", 2: "chlod" };

  /* Duza komorka idzie PIERWSZA w kodzie. Automatyczne rozmieszczanie
     wypelnia siatke po kolei: gdy trzy male zajmowaly pierwszy rzad, komorka
     "span 2 x 2" nie miescila sie juz w czwartej kolumnie i spadala nizej,
     zostawiajac dziure. */
  const posortowane = [...ustawienia.liczby].sort((a, b) => (b.wartosc === 20) - (a.wartosc === 20));

  const liczby = el("ul", "liczby");
  posortowane.forEach((l, i) => {
    /* Kolejnosc w danych: 400, 2000, 17000, 20 lat, 2 medale.
       Duza komorka dostaje "20 lat", bo to jest zdanie o firmie, a nie
       kolejna liczba w rzedzie. */
    const duza = l.wartosc === 20;
    const li = el("li", "liczby__poz" + (duza ? " liczby__poz--duza" : "")
      + (KOLOR_DLA[l.wartosc] ? " pole pole--" + KOLOR_DLA[l.wartosc] : " pole"));

    if (duza) {
      const img = document.createElement("img");
      img.className = "liczby__foto";
      img.src = "./assets/mems/psychologia-motywacji.webp";
      img.alt = "";
      img.width = 1860;
      img.height = 1866;
      img.loading = "lazy";
      li.appendChild(img);
      li.appendChild(el("span", "liczby__zaslona"));
    }

    const tresc = el("span", "liczby__tresc");
    const w = el("span", "liczby__wartosc", liczbaPl(l.wartosc));
    w.dataset.do = String(l.wartosc);
    tresc.appendChild(w);
    tresc.appendChild(el("span", "liczby__etykieta", pole(l, "etykieta")));
    if (l.do_potwierdzenia) {
      const z = el("span", "znacznik", "do potwierdzenia");
      z.title = "Liczba pochodzi ze starej strony. Czeka na potwierdzenie przez klienta.";
      tresc.appendChild(z);
    }
    li.appendChild(tresc);
    liczby.appendChild(li);
  });
  host.appendChild(liczby);
  policz(liczby);
  ujawnijZRozmyciem(liczby.querySelectorAll(".liczby__poz"), { odstep: 70 });

  /* ---------- opinie: bento o roznych wysokosciach ----------
     Szesc identycznych kafelkow w rowniutkiej siatce czyta sie jak tabela.
     Tu kazda kolumna ma inny podzial (duzy + maly, trzy rowne, maly + duzy),
     wiec oko ma po czym wodzic. Wagi sa w danych kolejnosci, nie losowe -
     uklad ma byc ten sam przy kazdym wejsciu. */
  const WAGI = ["duza", "mala", "srednia", "srednia", "mala", "duza"];

  const opinie = el("ul", "opinie");
  dane.opinie.forEach((o, i) => {
    const li = el("li", `opinie__poz opinie__poz--${WAGI[i] || "srednia"} pole pole--${grupaNaKolor(o.grupa)}`);

    const cyt = el("blockquote", "opinie__tresc", pole(o, "tresc"));

    const pod = el("figcaption", "opinie__podpis");
    const kto = el("span", "opinie__kto");
    kto.appendChild(el("span", "opinie__rola", pole(o, "rola")));
    kto.appendChild(el("span", "opinie__miasto", o.miasto));

    /* Kafel w kolorze roli zamiast zdjecia. Te opinie to PROPOZYCJE tekstu,
       nie cytaty prawdziwych osob - wstawienie im twarzy byloby fabrykowaniem
       dowodu spolecznego. Gdy przyjda prawdziwe opinie ze zgodami, kafel
       zamienia sie w zdjecie i nic poza tym sie nie zmienia. */
    const kafel = el("span", "opinie__kafel");
    kafel.setAttribute("aria-hidden", "true");

    pod.append(kto, kafel);
    li.append(cyt, pod);
    if (o.do_zatwierdzenia) li.appendChild(el("span", "znacznik", "propozycja do zatwierdzenia"));
    opinie.appendChild(li);
  });
  host.appendChild(opinie);
  ujawnijZRozmyciem(opinie.querySelectorAll(".opinie__poz"));

  /* ---------- logotypy ---------- */
  const lg = dane.logotypy;
  const blok = el("div", "logotypy");
  const siatka = el("ul", "logotypy__siatka");
  for (let i = 0; i < lg.ile_ramek; i++) siatka.appendChild(el("li", "logotypy__ramka"));
  blok.append(siatka, el("p", "logotypy__podpis", pole(lg, "podpis")));
  host.appendChild(blok);
}

const KOLORY_GRUP = { lekarz: "ogien", pacjent: "kwas", kontakt: "slonce", zarzad: "chlod", zespol: "fiolet" };
const grupaNaKolor = (g) => KOLORY_GRUP[g] || "ogien";

/* Liczniki. IntersectionObserver, nie nasłuch scrolla — nasłuch odpala się
   na każdej klatce i dławi telefon. */
function policz(zakres) {
  const mniejRuchu = matchMedia("(prefers-reduced-motion: reduce)");
  if (mniejRuchu.matches) return;   /* wartości docelowe już są w DOM */

  const obs = new IntersectionObserver((wpisy) => {
    for (const w of wpisy) {
      if (!w.isIntersecting) continue;
      obs.unobserve(w.target);
      const cel = Number(w.target.dataset.do);
      const start = performance.now();
      const czas = 1400;
      const krok = (teraz) => {
        const p = Math.min(1, (teraz - start) / czas);
        /* Wyhamowanie na końcu: liczba ma dojechać, a nie zatrzymać się w biegu. */
        const e = 1 - Math.pow(1 - p, 3);
        w.target.textContent = liczbaPl(Math.round(cel * e));
        if (p < 1) requestAnimationFrame(krok);
      };
      requestAnimationFrame(krok);
    }
  }, { threshold: 0.6 });

  zakres.querySelectorAll("[data-do]").forEach((n) => obs.observe(n));
}
