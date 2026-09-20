/* ==========================================================================
   DOWÓD — liczby, opinie, logotypy klinik.

   Stara strona ma wszystkie te liczby schowane w jednym zdaniu w środku
   akapitu, a zaproszenie „zobacz opinie" prowadzi donikąd, bo opinii nie ma.
   Ta sekcja robi z tego pierwszy argument, zaraz po hero.
   ========================================================================== */

import { pobierz, pole } from "./dane.js";

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

  /* ---------- liczby ---------- */
  const liczby = el("ul", "liczby");
  for (const l of ustawienia.liczby) {
    const li = el("li", "liczby__poz");
    const w = el("span", "liczby__wartosc", liczbaPl(l.wartosc));
    w.dataset.do = String(l.wartosc);
    li.appendChild(w);
    li.appendChild(el("span", "liczby__etykieta", pole(l, "etykieta")));
    if (l.do_potwierdzenia) {
      const z = el("span", "znacznik", "do potwierdzenia");
      z.title = "Liczba pochodzi ze starej strony. Czeka na potwierdzenie przez klienta.";
      li.appendChild(z);
    }
    liczby.appendChild(li);
  }
  host.appendChild(liczby);
  policz(liczby);

  /* ---------- opinie ---------- */
  const opinie = el("ul", "opinie");
  for (const o of dane.opinie) {
    const li = el("li", `opinie__poz pole pole--${grupaNaKolor(o.grupa)}`);
    const cyt = el("blockquote", "opinie__tresc", pole(o, "tresc"));
    const pod = el("figcaption", "opinie__podpis");
    pod.appendChild(el("span", "opinie__rola", pole(o, "rola")));
    pod.appendChild(el("span", "opinie__miasto", o.miasto));
    li.append(cyt, pod);
    /* Propozycja tekstu jest oznaczona WPROST. Klient ma widzieć, co jest
       jego treścią, a co naszą propozycją do akceptacji. */
    if (o.do_zatwierdzenia) li.appendChild(el("span", "znacznik", "propozycja do zatwierdzenia"));
    opinie.appendChild(li);
  }
  host.appendChild(opinie);

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
