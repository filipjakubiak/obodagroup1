import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import fs from "node:fs";
const OUT = "tests/zrzuty/"; fs.mkdirSync(OUT, { recursive: true });
const s = await startSerwera(4331);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
const bledy = [];
p.on("pageerror", (e) => bledy.push(String(e)));
p.on("console", (m) => { if (m.type() === "error") bledy.push(m.text()); });
await p.goto(s.url, { waitUntil: "networkidle" });
await p.evaluate(() => document.getElementById("final").scrollIntoView());
await p.waitForTimeout(1500);
/* Ruch mysza: plamy maja podazyc z opoznieniem. */
await p.mouse.move(1200, 700);
await p.waitForTimeout(1400);
await p.screenshot({ path: OUT + "final.png" });
const d = await p.evaluate(() => ({
  plamy: document.querySelectorAll(".final__plama").length,
  przesuniete: [...document.querySelectorAll(".final__plama")]
    .filter((x) => x.style.transform && !x.style.transform.includes("0px, 0px")).length,
}));
console.log(JSON.stringify(d));
console.log("bledy:", bledy.length ? bledy.slice(0, 3) : "brak");

/* Przy wylaczonym ruchu nic nie ma prawa sie ruszyc. */
const ctx = await b.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 950 } });
const p2 = await ctx.newPage();
await p2.goto(s.url, { waitUntil: "networkidle" });
await p2.evaluate(() => document.getElementById("final").scrollIntoView());
await p2.mouse.move(1200, 700);
await p2.waitForTimeout(1200);
const rm = await p2.evaluate(() =>
  [...document.querySelectorAll(".final__plama")].filter((x) => x.style.transform).length);
console.log("przy wylaczonym ruchu przesunietych plam:", rm, rm === 0 ? "OK" : "ZLE");
await p2.screenshot({ path: OUT + "final-bez-ruchu.png" });
await b.close(); s.stop();
