import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import fs from "node:fs";
const OUT = "tests/zrzuty/"; fs.mkdirSync(OUT, { recursive: true });
const s = await startSerwera(4324);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bledy = [];
p.on("pageerror", (e) => bledy.push(String(e)));
p.on("console", (m) => { if (m.type() === "error") bledy.push(m.text()); });
await p.goto(s.url, { waitUntil: "networkidle" });
await p.waitForTimeout(1400);
await p.screenshot({ path: OUT + "hero-slajd-0.png" });

/* Klik w kropke 3 (zarzadzanie, blekit) i sprawdzenie, czy grunt poszedl. */
await p.click(".hero__kropka:nth-child(4)");
await p.waitForTimeout(1800);
await p.screenshot({ path: OUT + "hero-slajd-3.png" });
const st = await p.evaluate(() => {
  const h = document.getElementById("hero");
  const r = [...document.querySelectorAll(".hero__rola")];
  return {
    klasa: h.className,
    tlo: getComputedStyle(h).backgroundColor,
    aktywnaKropka: [...document.querySelectorAll(".hero__kropka")].findIndex((k) => k.classList.contains("is-on")),
    wypelnienia: r.map((x) => {
      const t = x.closest(".hero__tytul").getBoundingClientRect().width;
      return +(x.getBoundingClientRect().width / t).toFixed(3);
    }),
    osie: r.map((x) => getComputedStyle(x).fontVariationSettings),
  };
});
console.log(JSON.stringify(st, null, 1));
console.log("bledy:", bledy.length ? bledy.slice(0, 3) : "brak");
const m = await p.evaluate(() => ({ szer: document.documentElement.scrollWidth, okno: innerWidth }));
console.log("poziome przewijanie strony:", JSON.stringify(m), m.szer <= m.okno + 1 ? "OK" : "PRZEWIJA");
await b.close(); s.stop();
