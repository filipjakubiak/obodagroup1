/* Fundament: kontrasty palety w obu trybach, start strony pod podkatalogiem,
   dojście fontów, spójność kolorów grup.

   🚨 Zasada tego pliku: NIE DUBLUJEMY wartości z tokens.css.
   Pierwsza wersja miała wpisane hexy z ręki i po przebudowie palety dalej
   świeciła na zielono, sprawdzając kolory, których już nie było. Test, który
   nie pada przy zmianie, nie jest testem. Teraz wartości czytamy ze źródła. */

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import { kontrast, naRgb, zCss, sprawdz, wynik, sprawdzArkusze } from "./pomocniki.mjs";

/* ---------- odczyt palety prosto z tokens.css ---------- */

const css = fs.readFileSync(new URL("../css/tokens.css", import.meta.url), "utf8");
const blokJasny = css.slice(0, css.indexOf("@media (prefers-color-scheme: dark)"));
const blokCiemny = css.slice(css.indexOf("@media (prefers-color-scheme: dark)"));

function token(blok, nazwa) {
  const m = blok.match(new RegExp("--" + nazwa + ":\\s*(#[0-9A-Fa-f]{6})"));
  return m ? m[1] : null;
}
/* Tryb ciemny nadpisuje tylko część tokenów — reszta zostaje z trybu jasnego. */
const tokenCiemny = (n) => token(blokCiemny, n) || token(blokJasny, n);

const KOLORY = ["ogien", "kwas", "slonce", "chlod", "fiolet"];
const para = (a, b) => kontrast(naRgb(a), naRgb(b));

console.log("== integralnosc arkuszy ==");
sprawdzArkusze(fileURLToPath(new URL("../css", import.meta.url)), sprawdz);

console.log("\n== paleta: tryb jasny ==");
const paper = token(blokJasny, "paper");
const ink = token(blokJasny, "ink");
sprawdz("tokens.css da sie odczytac", !!paper && !!ink, JSON.stringify({ paper, ink }));

for (const n of ["ink", "ink-dim", ...KOLORY.map((k) => k + "-tekst")]) {
  const k = para(token(blokJasny, n), paper);
  sprawdz(`${n} na paper >= 4.5:1`, k >= 4.5, k.toFixed(2));
}

console.log("\n== tekst czytelny na wlasnym gruncie sekcji ==");
for (const n of KOLORY) {
  const k = para(token(blokJasny, n + "-tekst"), token(blokJasny, n + "-mgla"));
  sprawdz(`${n}-tekst na ${n}-mgla >= 4.5:1`, k >= 4.5, k.toFixed(2));
}

console.log("\n== tekst na pelnym polu koloru ==");
const NA = { ogien: "na-ogniu", kwas: "na-kwasie", slonce: "na-sloncu", chlod: "na-chlodzie", fiolet: "na-fiolecie" };
for (const n of KOLORY) {
  const k = para(token(blokJasny, NA[n]), token(blokJasny, n));
  sprawdz(`${NA[n]} na pelnym ${n} >= 4.5:1`, k >= 4.5, k.toFixed(2));
}

console.log("\n== zakaz zoltego jako tekstu ==");
sprawdz("zolty markowy jako TEKST na paper jest nieczytelny (dlatego zakazany)",
  para(token(blokJasny, "slonce"), paper) < 3, para(token(blokJasny, "slonce"), paper).toFixed(2));

console.log("\n== paleta: tryb ciemny ==");
const paperC = tokenCiemny("paper");
for (const n of ["ink", "ink-dim", ...KOLORY.map((k) => k + "-tekst")]) {
  const k = para(tokenCiemny(n), paperC);
  sprawdz(`${n} na ciemnym paper >= 4.5:1`, k >= 4.5, k.toFixed(2));
}
for (const n of KOLORY) {
  const k = para(tokenCiemny(n + "-tekst"), tokenCiemny(n + "-mgla"));
  sprawdz(`[ciemny] ${n}-tekst na ${n}-mgla >= 4.5:1`, k >= 4.5, k.toFixed(2));
}

/* ---------- przegladarka ---------- */

console.log("\n== strona pod podkatalogiem ==");
const s = await startSerwera(4310);
const b = await chromium.launch();

for (const schemat of ["light", "dark"]) {
  const ctx = await b.newContext({ colorScheme: schemat, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const bledy = [];
  p.on("pageerror", (e) => bledy.push("JS: " + e));
  p.on("console", (m) => { if (m.type() === "error") bledy.push("konsola: " + m.text()); });
  p.on("response", (r) => { if (r.status() >= 400) bledy.push(r.status() + " " + r.url()); });

  await p.goto(s.url, { waitUntil: "networkidle" });
  sprawdz(`[${schemat}] strona wstaje pod /obodagroup/ bez 404 i bez bledow JS`,
    bledy.length === 0, bledy.slice(0, 3).join(" | "));

  const fonty = await p.evaluate(async () => {
    await document.fonts.ready;
    return { display: document.fonts.check("700 1em Archivo"), tekst: document.fonts.check("400 1em Geist") };
  });
  sprawdz(`[${schemat}] font display Archivo doszedl`, fonty.display, JSON.stringify(fonty));
  sprawdz(`[${schemat}] font tekstowy Geist doszedl`, fonty.tekst, JSON.stringify(fonty));
  await ctx.close();
}

console.log("\n== telefon 390 px ==");
const ctxTel = await b.newContext({ viewport: { width: 390, height: 844 } });
const tel = await ctxTel.newPage();
await tel.goto(s.url, { waitUntil: "networkidle" });
const m = await tel.evaluate(() => ({ szer: document.documentElement.scrollWidth, okno: innerWidth }));
sprawdz("brak przewijania w bok przy 390 px", m.szer <= m.okno + 1, JSON.stringify(m));

/* Kolory grup MUSZA istniec jako klasy .pole--*.
   Test powstal po realnym bledzie: token "ziemia" zostal przemianowany na
   "kwas", ale data/szkolenia.json dalej mowil "ziemia". Klasa nie istniala,
   --kolor spadal na domyslny atrament i kafelek grupy renderowal sie na
   czarno. Zaden inny test tego nie widzial. */
console.log("\n== kolory grup istnieja w CSS ==");
const p2 = await (await b.newContext()).newPage();
await p2.goto(s.url, { waitUntil: "networkidle" });
const dane = JSON.parse(fs.readFileSync(new URL("../data/szkolenia.json", import.meta.url), "utf8"));
for (const g of dane.grupy) {
  const kolor = await p2.evaluate((klasa) => {
    const d = document.createElement("div");
    d.className = "pole pole--" + klasa;
    d.style.cssText = "position:absolute;visibility:hidden";
    document.body.appendChild(d);
    const k = getComputedStyle(d).getPropertyValue("--kolor").trim();
    d.remove();
    return k;
  }, g.kolor);
  sprawdz(`grupa "${g.id}" ma zdefiniowana klase .pole--${g.kolor}`,
    !!kolor && kolor.toLowerCase() !== ink.toLowerCase(), g.kolor + " -> " + kolor);
}

await b.close();
s.stop();
wynik();
