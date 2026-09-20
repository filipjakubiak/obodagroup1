/* ==========================================================================
   Gotowość do wdrożenia na GitHub Pages.

   Najdroższy błąd przy statyku serwowanym z podkatalogu to ścieżka
   bezwzględna: lokalnie działa, po wdrożeniu daje 404. Ten test szuka ich
   mechanicznie w źródłach ORAZ sprawdza, że przeglądarka nie zgłasza
   ani jednego żądania 404 na żadnej stronie.
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import { sprawdz, wynik } from "./pomocniki.mjs";

const KORZEN = fileURLToPath(new URL("..", import.meta.url));

console.log("== sciezki wzgledne w zrodlach ==");
{
  const pliki = [];
  const zbierz = (kat) => {
    for (const w of fs.readdirSync(kat, { withFileTypes: true })) {
      if (["node_modules", ".git", "_scrape", "tests"].includes(w.name)) continue;
      const p = path.join(kat, w.name);
      if (w.isDirectory()) zbierz(p);
      else if (/\.(html|css|js)$/.test(w.name)) pliki.push(p);
    }
  };
  zbierz(KORZEN);

  const winne = [];
  for (const p of pliki) {
    const tresc = fs.readFileSync(p, "utf8");
    /* Szukamy src/href zaczynajacych sie od pojedynczego ukosnika. Adresy
       pelne (https://) i protokolowzgledne (//) sa w porzadku. */
    for (const m of tresc.matchAll(/(?:src|href)="(\/[^/][^"]*)"/g)) {
      winne.push(path.relative(KORZEN, p) + " -> " + m[1]);
    }
    for (const m of tresc.matchAll(/url\((["']?)(\/[^/)"']+)/g)) {
      winne.push(path.relative(KORZEN, p) + " -> url(" + m[2]);
    }
  }
  sprawdz(`zero sciezek bezwzglednych w ${pliki.length} plikach`, winne.length === 0,
    winne.slice(0, 5).join(" | "));
}

console.log("\n== komplet plikow ==");
for (const p of ["index.html", "mems.html", "szkolenia.html", "szkolenie.html",
  "zespol.html", "wyjazdy.html", "kontakt.html", "polityka-prywatnosci.html",
  "en/index.html", "sitemap.xml", "robots.txt", ".nojekyll"]) {
  sprawdz(`jest ${p}`, fs.existsSync(path.join(KORZEN, p)));
}

console.log("\n== serwowanie z podkatalogu ==");
const s = await startSerwera(4322);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });

const brakujace = [];
p.on("response", (r) => { if (r.status() >= 400) brakujace.push(r.status() + " " + r.url()); });

for (const adres of ["", "mems.html", "szkolenia.html", "szkolenie.html?id=lider",
  "zespol.html", "wyjazdy.html", "kontakt.html", "polityka-prywatnosci.html", "en/"]) {
  brakujace.length = 0;
  await p.goto(s.url + adres, { waitUntil: "networkidle" });
  /* Przewiniecie odslania obrazy z loading="lazy" - bez tego ich 404
     nigdy by sie nie ujawnilo. */
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
  });
  await p.waitForTimeout(900);
  sprawdz(`${adres || "index"}: zero zadan 404`, brakujace.length === 0,
    brakujace.slice(0, 3).join(" | "));
}

console.log("\n== przelacznik jezyka dziala w obie strony ==");
await p.goto(s.url, { waitUntil: "networkidle" });
await p.click(".naglowek__jezyk");
await p.waitForLoadState("networkidle");
sprawdz("z polskiej na angielska", p.url().includes("/en/"), p.url());
await p.click(".naglowek__jezyk");
await p.waitForLoadState("networkidle");
sprawdz("z angielskiej z powrotem na polska", !p.url().includes("/en/"), p.url());

console.log("\n== sitemap ==");
const mapa = fs.readFileSync(path.join(KORZEN, "sitemap.xml"), "utf8");
sprawdz("sitemap wymienia siedem adresow", (mapa.match(/<url>/g) || []).length === 7,
  String((mapa.match(/<url>/g) || []).length));
sprawdz("sitemap nie wystawia strony szczegolu", !mapa.includes("szkolenie.html"));

await b.close();
s.stop();
wynik();
