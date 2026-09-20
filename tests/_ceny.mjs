import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import fs from "node:fs";
const OUT = "tests/zrzuty/"; fs.mkdirSync(OUT, { recursive: true });
const s = await startSerwera(4326);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.goto(s.url + "mems.html", { waitUntil: "networkidle" });
await p.evaluate(() => document.querySelector(".proces").scrollIntoView());
await p.waitForTimeout(2200);
await p.screenshot({ path: OUT + "ceny.png" });
const d = await p.evaluate(() => ({
  kroki: document.querySelectorAll(".krok").length,
  karty: document.querySelectorAll(".ceny__poz").length,
  kwoty: [...document.querySelectorAll(".ceny__kwota")].map((n) => n.textContent),
  razem: [...document.querySelectorAll(".ceny__razemKwota")].map((n) => n.textContent),
  roznice: [...document.querySelectorAll(".ceny__roznica")].map((n) => n.textContent),
}));
console.log(JSON.stringify(d, null, 1));
await b.close(); s.stop();
