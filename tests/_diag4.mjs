import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
const s = await startSerwera(4325);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(s.url, { waitUntil: "networkidle" });
await p.waitForTimeout(2000);
const d = await p.evaluate(() => {
  const sl = document.querySelector(".hero__slajd");
  const q = (s) => sl.querySelector(s);
  const w = (e) => e ? Math.round(e.getBoundingClientRect().width) : null;
  return {
    slajd: w(sl),
    srodek: w(q(".hero__srodek")),
    tytul: w(q(".hero__tytul")),
    rola: w(q(".hero__rola")),
    stopien: getComputedStyle(q(".hero__rola")).fontSize,
    rodzina: getComputedStyle(q(".hero__rola")).fontFamily.split(",")[0],
    displaySrodek: getComputedStyle(q(".hero__srodek")).display,
    alignItems: getComputedStyle(q(".hero__srodek")).alignItems,
  };
});
console.log(JSON.stringify(d, null, 1));
await b.close(); s.stop();
