import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import fs from "node:fs";
const OUT = "tests/zrzuty/"; fs.mkdirSync(OUT, { recursive: true });
const s = await startSerwera(4314);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bledy = [];
p.on("pageerror", (e) => bledy.push(String(e)));
p.on("console", (m) => { if (m.type() === "error") bledy.push(m.text()); });
p.on("response", (r) => { if (r.status() >= 400) bledy.push(r.status() + " " + r.url()); });
await p.goto(s.url, { waitUntil: "networkidle" });
await p.waitForTimeout(900);
for (const [id, nazwa] of [["dowod", "dowod"], ["mems", "mems"]]) {
  await p.evaluate((x) => document.getElementById(x).scrollIntoView(), id);
  await p.waitForTimeout(2600);
  await p.screenshot({ path: OUT + nazwa + ".png" });
  await p.evaluate(() => scrollBy(0, 720));
  await p.waitForTimeout(2200);
  await p.screenshot({ path: OUT + nazwa + "-dol.png" });
}
const st = await p.evaluate(() => ({
  liczby: document.querySelectorAll(".liczby__poz").length,
  opinie: document.querySelectorAll(".opinie__poz").length,
  ramki: document.querySelectorAll(".logotypy__ramka").length,
  moduly: document.querySelectorAll(".mems__poz").length,
  ceny: [...document.querySelectorAll(".ceny__kwota")].map((n) => n.textContent),
  znaczniki: document.querySelectorAll(".znacznik").length,
}));
console.log(JSON.stringify(st));
console.log("bledy:", bledy.length ? bledy.slice(0, 4) : "brak");
await b.close(); s.stop();
