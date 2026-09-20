import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import fs from "node:fs";
const OUT = "tests/zrzuty/"; fs.mkdirSync(OUT, { recursive: true });
const s = await startSerwera(4320);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
for (const [a, n] of [["zespol.html","zespol"],["wyjazdy.html","wyjazdy"],["kontakt.html","kontakt"],["mems.html","mems-strona"]]) {
  await p.goto(s.url + a, { waitUntil: "networkidle" });
  await p.waitForTimeout(2600);
  await p.screenshot({ path: OUT + n + ".png" });
}
await b.close(); s.stop();
console.log("zrzuty gotowe");
