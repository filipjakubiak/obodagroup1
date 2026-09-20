/* Fundament: kontrasty palety w obu trybach, start strony pod podkatalogiem,
   dojście fontów. Ten test istnieje po to, żeby pewne błędy były NIEMOŻLIWE,
   a nie tylko niechciane. */
import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import { kontrast, naRgb, zCss, sprawdz, wynik } from "./pomocniki.mjs";

console.log("== paleta: tryb jasny ==");
const JASNY = {
  paper: "#F4F1EB", ink: "#141210", inkDim: "#5E584F",
  ogien: "#C40025", ziemia: "#00703B", slonce: "#6B4A00", chlod: "#005A91",
  poleSlonce: "#FFC72C", poleOgien: "#E4002B", poleZiemia: "#00A758", poleChlod: "#0076BF",
};
const para = (a, b) => kontrast(naRgb(a), naRgb(b));

for (const [nazwa, kolor] of [["ink", JASNY.ink], ["ink-dim", JASNY.inkDim],
  ["ogien-tekst", JASNY.ogien], ["ziemia-tekst", JASNY.ziemia],
  ["slonce-tekst", JASNY.slonce], ["chlod-tekst", JASNY.chlod]]) {
  const k = para(kolor, JASNY.paper);
  sprawdz(`${nazwa} na paper >= 4.5:1`, k >= 4.5, k.toFixed(2));
}

console.log("\n== tekst na polach koloru ==");
for (const [nazwa, pole, tekst] of [
  ["bialy na ogniu", JASNY.poleOgien, "#FFFFFF"],
  ["ink na ziemi", JASNY.poleZiemia, JASNY.ink],
  ["ink na sloncu", JASNY.poleSlonce, JASNY.ink],
  ["bialy na chlodzie", JASNY.poleChlod, "#FFFFFF"],
]) {
  const k = para(tekst, pole);
  sprawdz(`${nazwa} >= 4.5:1`, k >= 4.5, k.toFixed(2));
}

console.log("\n== para jasnych kolorow nie przyjmuje bialego tekstu ==");
/* To nie jest obejscie porazki, tylko regula wyczytana z palety: ogien i chlod
   sa ciemne (biala czcionka), ziemia i slonce jasne (czcionka atramentowa).
   Pilnujemy jej wprost, zeby nikt nie wrocil kiedys do bialego na zieleni. */
for (const [nazwa, pole] of [["ziemia", JASNY.poleZiemia], ["slonce", JASNY.poleSlonce]]) {
  sprawdz(`bialy na ${nazwa} NIE przechodzi - dlatego te pola biora tekst atramentowy`,
    para("#FFFFFF", pole) < 4.5, para("#FFFFFF", pole).toFixed(2));
}

console.log("\n== zakaz zoltego jako tekstu ==");
sprawdz("zolty markowy jako TEKST na paper jest nieczytelny (dlatego zakazany)",
  para(JASNY.poleSlonce, JASNY.paper) < 3, para(JASNY.poleSlonce, JASNY.paper).toFixed(2));

console.log("\n== paleta: tryb ciemny ==");
const CIEMNY = {
  paper: "#121110", ink: "#F4F1EB", inkDim: "#A49C90",
  ogien: "#FF6B80", ziemia: "#4FD48C", slonce: "#FFC72C", chlod: "#6FB8EE",
};
for (const [nazwa, kolor] of [["ink", CIEMNY.ink], ["ink-dim", CIEMNY.inkDim],
  ["ogien-tekst", CIEMNY.ogien], ["ziemia-tekst", CIEMNY.ziemia],
  ["slonce-tekst", CIEMNY.slonce], ["chlod-tekst", CIEMNY.chlod]]) {
  const k = para(kolor, CIEMNY.paper);
  sprawdz(`${nazwa} na ciemnym paper >= 4.5:1`, k >= 4.5, k.toFixed(2));
}

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

  /* Tokeny muszą naprawdę dojść do przeglądarki, nie tylko istnieć w pliku. */
  const zmierzone = await p.evaluate(() => {
    const s = getComputedStyle(document.body);
    return { tlo: s.backgroundColor, tekst: s.color, font: s.fontFamily };
  });
  const k = kontrast(zCss(zmierzone.tekst), zCss(zmierzone.tlo));
  sprawdz(`[${schemat}] zmierzony kontrast body >= 4.5:1`, k >= 4.5, k.toFixed(2) + " " + JSON.stringify(zmierzone));

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

await b.close();
s.stop();
wynik();
