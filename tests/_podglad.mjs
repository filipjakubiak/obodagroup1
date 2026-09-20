/* Zrzuty hero we wszystkich pięciu stanach osobowości + telefon. */
import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import fs from "node:fs";
const OUT = "tests/zrzuty/"; fs.mkdirSync(OUT, { recursive: true });
const s = await startSerwera(4311);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bledy = [];
p.on("pageerror", (e) => bledy.push(String(e)));
p.on("console", (m) => { if (m.type() === "error") bledy.push(m.text()); });
p.on("response", (r) => { if (r.status() >= 400) bledy.push(r.status() + " " + r.url()); });
await p.goto(s.url, { waitUntil: "networkidle" });
await p.waitForTimeout(1200);

/* Zatrzymujemy karuzelę i ustawiamy stany ręcznie, żeby zrzuty były powtarzalne. */
const ROLE = [["lekarza","ogien"],["rejestratorkę","slonce"],["higienistkę","kwas"],["menedżera","chlod"],["cały zespół","fiolet"]];
for (let i = 0; i < ROLE.length; i++) {
  await p.evaluate(([slowo, pole]) => {
    const h = document.getElementById("hero");
    h.className = "hero pole pole--" + pole;
    const r = h.querySelector(".hero__rola");
    r.textContent = slowo;
    /* Powtórzenie dopasowania osi po ręcznej podmianie słowa. */
    let lo = 62, hi = 125;
    r.style.width = "fit-content";
    const cel = r.parentElement.getBoundingClientRect().width;
    r.style.transition = "none";   /* pomiar w trakcie animacji klamie */
    for (let k = 0; k < 14; k++) {
      const sr = (lo + hi) / 2;
      r.style.fontVariationSettings = '"wdth" ' + sr;
      if (r.getBoundingClientRect().width < cel) lo = sr; else hi = sr;
    }
    return r.style.fontVariationSettings;
  }, ROLE[i]);
  await p.waitForTimeout(1400);  /* dluzej niz najwolniejsze tempo (1050ms) */
  await p.screenshot({ path: OUT + "hero-" + i + "-" + ROLE[i][1] + ".png" });
}
/* Pomiar wypełnienia linii — sedno mechanizmu. */
const m = await p.evaluate(() => {
  const r = document.querySelector(".hero__rola"), t = document.querySelector(".hero__tytul");
  return { rola: Math.round(r.getBoundingClientRect().width), linia: Math.round(t.getBoundingClientRect().width),
           os: getComputedStyle(r).fontVariationSettings };
});
console.log("wypelnienie linii:", (100 * m.rola / m.linia).toFixed(1) + "%", JSON.stringify(m));

const tel = await b.newPage({ viewport: { width: 390, height: 844 } });
await tel.goto(s.url, { waitUntil: "networkidle" });
await tel.waitForTimeout(1200);
await tel.screenshot({ path: OUT + "hero-telefon.png" });
const t2 = await tel.evaluate(() => ({ szer: document.documentElement.scrollWidth, okno: innerWidth }));
console.log("telefon 390:", JSON.stringify(t2), t2.szer <= t2.okno + 1 ? "OK" : "PRZEWIJA W BOK");
console.log("bledy:", bledy.length ? bledy.slice(0,5) : "brak");
await b.close(); s.stop();
