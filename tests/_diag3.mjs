import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
const s = await startSerwera(4323);
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(s.url, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const d = await p.evaluate(() => {
  const uzyte = new Set();
  document.querySelectorAll("h1,h2,h3,p,a,span,li,button").forEach((e) => {
    if ((e.textContent || "").trim()) uzyte.add(getComputedStyle(e).fontFamily.split(",")[0].replace(/["']/g, ""));
  });
  return {
    rodziny: [...uzyte],
    h1: getComputedStyle(document.querySelector("h1")).fontFamily,
    akapit: getComputedStyle(document.querySelector(".hero__lead")).fontFamily,
    zaladowane: [...document.fonts].map((f) => f.family + " " + f.weight).filter((x, i, a) => a.indexOf(x) === i),
  };
});
console.log(JSON.stringify(d, null, 1));
await b.close(); s.stop();
