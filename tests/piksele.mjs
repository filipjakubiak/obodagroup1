/* ==========================================================================
   Kontrast na WYMALOWANYCH pikselach.

   Sekcja finałowa ma pod tekstem ruchome plamy koloru. getComputedStyle
   zwraca tam kolor tła sekcji, więc zwykły test kontrastu widzi ciemny
   atrament i przepuszcza wszystko — a oko widzi żółć.

   Ten test robi zrzut obszaru pod tekstem z ukrytą treścią i liczy
   kontrast względem NAJGORSZEGO piksela, nie średniej. Przy pierwszym
   uruchomieniu wyszło 1.75:1: nagłówek był nieczytelny nad żółtą plamą.
   ========================================================================== */

import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import { kontrast, sprawdz, wynik } from "./pomocniki.mjs";

const TEKST = [244, 241, 235];   /* --paper, kolor tekstu w tej sekcji */

const s = await startSerwera(4332);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
await p.goto(s.url, { waitUntil: "networkidle" });
await p.evaluate(() => document.getElementById("final").scrollIntoView());
await p.waitForTimeout(1600);

console.log("== sekcja finalowa: kontrast na pikselach ==");

for (const [nazwa, sel, prog] of [
  ["naglowek (duzy tekst)", ".final__tytul", 3],
  ["lead (maly tekst)", ".final__lead", 4.5],
  ["nadtytul (maly tekst)", ".final__nadtytul", 4.5],
]) {
  const pudlo = await p.evaluate((x) => {
    const r = document.querySelector(x).getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
  }, sel);
  if (pudlo.width < 4 || pudlo.height < 4) continue;

  await p.evaluate(() => { document.querySelector(".final__tresc").style.visibility = "hidden"; });
  await p.waitForTimeout(220);
  const tlo = await p.screenshot({ clip: pudlo });
  await p.evaluate(() => { document.querySelector(".final__tresc").style.visibility = ""; });

  const piksele = await p.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const lista = [];
    /* Co 97. piksel: liczba pierwsza, wiec probka nie uklada sie w pasy
       zgodne z szerokoscia obrazu. */
    for (let i = 0; i < d.length; i += 4 * 97) lista.push([d[i], d[i + 1], d[i + 2]]);
    return lista;
  }, tlo.toString("base64"));

  let najgorszy = Infinity;
  let winny = null;
  for (const px of piksele) {
    const k = kontrast(TEKST, px);
    if (k < najgorszy) { najgorszy = k; winny = px; }
  }
  sprawdz(`${nazwa} >= ${prog}:1 na kazdym pikselu tla`, najgorszy >= prog,
    najgorszy.toFixed(2) + " na rgb(" + winny.join(",") + "), probek " + piksele.length);
}

await b.close();
s.stop();
wynik();
