import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
const s = await startSerwera(4313);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(s.url, { waitUntil: "networkidle" });
await p.evaluate(() => document.getElementById("gabinet").scrollIntoView());
await p.waitForTimeout(2500);
const d = await p.evaluate(() => [...document.querySelectorAll(".gabinet__karta")].map((k) => {
  const st = getComputedStyle(k);
  const z = k.querySelector(".gabinet__zalew");
  const img = k.querySelector(".gabinet__foto");
  return {
    klasy: k.className.replace("gabinet__karta ", ""),
    kolor: st.getPropertyValue("--kolor").trim(),
    zalewTlo: z ? getComputedStyle(z).backgroundColor : null,
    zalewClip: z ? getComputedStyle(z).clipPath : null,
    blend: z ? getComputedStyle(z).mixBlendMode : null,
    img: img ? img.currentSrc.replace(/.*\//, "") : null,
    zaladowany: img ? img.naturalWidth > 0 : null,
  };
}));
d.forEach((x) => console.log(JSON.stringify(x)));
await b.close(); s.stop();
