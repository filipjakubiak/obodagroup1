/* ==========================================================================
   Cele dotykowe.

   Reguła z wytycznych Apple i Material: element, w który trzeba trafić
   palcem, ma mieć co najmniej 44 x 44 px i 8 px odstępu od sąsiada.
   Sprawdzamy realną powierzchnię trafienia na wyrenderowanej stronie
   przy szerokości telefonu, bo to tam palec jest jedynym narzędziem.

   Liczy się pudełko elementu ORAZ jego wypełnienie: mała kropka
   z dużym paddingiem jest w porządku, duża ikona bez niego nie.
   ========================================================================== */

import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import { sprawdz, wynik } from "./pomocniki.mjs";

const MIN = 44;
const STRONY = ["", "mems.html", "szkolenia.html", "zespol.html", "wyjazdy.html", "kontakt.html"];

const s = await startSerwera(4328);
const b = await chromium.launch();
const ctx = await b.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});
const p = await ctx.newPage();

for (const adres of STRONY) {
  await p.goto(s.url + adres, { waitUntil: "networkidle" });
  /* Przewijamy, zeby odslonic tresc chowana do animacji. */
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0);
  });
  await p.waitForTimeout(2600);

  const male = await p.evaluate((min) => {
    const wynik = [];
    const elementy = document.querySelectorAll(
      'a, button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'
    );
    for (const e of elementy) {
      const r = e.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;          /* schowane */
      const st = getComputedStyle(e);
      if (st.visibility === "hidden" || st.display === "none") continue;
      /* Odnosniki w biegu tekstu sa wyjete: ich cel to wiersz tekstu,
         a wymaganie 44 px dotyczy samodzielnych przyciskow i ikon. */
      const wTekscie = e.tagName === "A" && e.closest("p, li, .tekst__tresc");
      if (wTekscie) continue;
      /* Pole opakowane etykieta: prawdziwym celem jest etykieta, nie sam
         kwadracik. Sprawdzamy wiec JA, a nie pole w srodku. */
      const etykieta = e.closest("label");
      if (etykieta && e.type === "checkbox") {
        const re = etykieta.getBoundingClientRect();
        if (re.width >= min && re.height >= min) continue;
      }
      if (r.width < min || r.height < min) {
        wynik.push({
          co: e.className || e.tagName,
          tekst: (e.textContent || "").trim().slice(0, 28),
          szer: Math.round(r.width),
          wys: Math.round(r.height),
        });
      }
    }
    return wynik;
  }, MIN);

  sprawdz(`${adres || "index"}: wszystkie cele dotykowe >= ${MIN} px`,
    male.length === 0,
    male.slice(0, 4).map((m) => `${m.co} "${m.tekst}" ${m.szer}x${m.wys}`).join(" | "));
}

/* Opoznienie 300 ms przy tapnieciu znika, gdy przegladarka wie, ze strona
   nie czeka na podwojne tapniecie. */
await p.goto(s.url, { waitUntil: "networkidle" });
const manipulation = await p.evaluate(() =>
  getComputedStyle(document.body).touchAction);
sprawdz("touch-action ogranicza opoznienie tapniecia",
  manipulation === "manipulation" || manipulation === "pan-y", manipulation);

await b.close();
s.stop();
wynik();
