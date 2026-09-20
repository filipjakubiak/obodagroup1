import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
const s = await startSerwera(4321);
const b = await chromium.launch();
for (const [strona] of [["index.html"], ["zespol.html"]]) {
  const p = await b.newPage();
  await p.goto(s.url + strona, { waitUntil: "networkidle" });
  const d = await p.evaluate(() => {
    const e = document.querySelector(".stopka__adres");
    if (!e) return "brak";
    const st = getComputedStyle(e);
    const stopka = document.querySelector(".stopka");
    return {
      kolorTekstu: st.color,
      tloStopki: getComputedStyle(stopka).backgroundColor,
      ink: getComputedStyle(document.documentElement).getPropertyValue("--ink").trim(),
      paper: getComputedStyle(document.documentElement).getPropertyValue("--paper").trim(),
      inkWStopce: getComputedStyle(stopka).getPropertyValue("--ink").trim(),
      paperWStopce: getComputedStyle(stopka).getPropertyValue("--paper").trim(),
    };
  });
  console.log(strona, JSON.stringify(d));
  await p.close();
}
await b.close(); s.stop();
