import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import fs from "node:fs";
const OUT = "tests/zrzuty/"; fs.mkdirSync(OUT, { recursive: true });
const s = await startSerwera(4329);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
const bledy = [];
p.on("pageerror", (e) => bledy.push(String(e)));
p.on("console", (m) => { if (m.type() === "error") bledy.push(m.text()); });
p.on("response", (r) => { if (r.status() >= 400) bledy.push(r.status() + " " + r.url()); });

await p.goto(s.url + "wyjazdy.html", { waitUntil: "networkidle" });
await p.waitForSelector(".wyjazd.widoczna");
await p.waitForTimeout(1800);
await p.screenshot({ path: OUT + "wyjazdy.png" });

await p.goto(s.url + "kontakt.html", { waitUntil: "networkidle" });
await p.waitForSelector(".czlowiek");
await p.waitForTimeout(1200);
await p.screenshot({ path: OUT + "kontakt.png" });

/* Wybor adresata dziala i widac go w formularzu. */
await p.click(".czlowiek:nth-child(2) .czlowiek__wybierz");
await p.waitForTimeout(900);
const st = await p.evaluate(() => ({
  aktywna: document.querySelectorAll(".czlowiek.is-on").length,
  adresat: document.querySelector(".form__adresat")?.textContent || "",
  ukryty: document.querySelector(".form__adresat")?.hidden,
  wDanych: document.querySelector(".form")?.dataset.adresat || "",
  aria: document.querySelector(".czlowiek.is-on .czlowiek__wybierz")?.getAttribute("aria-pressed"),
  napisy: document.querySelectorAll(".wyjazd__napis").length,
}));
console.log(JSON.stringify(st, null, 1));
await p.screenshot({ path: OUT + "kontakt-wybor.png" });
console.log("bledy:", bledy.length ? bledy.slice(0, 3) : "brak");
await b.close(); s.stop();
