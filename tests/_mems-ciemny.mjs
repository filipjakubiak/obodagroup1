/* MEMS ma byc bialy takze przy systemie w trybie ciemnym. */
import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import fs from "node:fs";
const OUT = "tests/zrzuty/"; fs.mkdirSync(OUT, { recursive: true });
const s = await startSerwera(4327);
const b = await chromium.launch();
for (const schemat of ["light", "dark"]) {
  const ctx = await b.newContext({ colorScheme: schemat, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(s.url + "mems.html", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  const tlo = await p.evaluate(() => getComputedStyle(document.querySelector(".mems")).backgroundColor);
  console.log(schemat + ": tlo sekcji MEMS =", tlo, tlo === "rgb(255, 255, 255)" ? "BIALE OK" : "NIE BIALE");
  await p.screenshot({ path: OUT + "mems-" + schemat + ".png" });
  await ctx.close();
}
await b.close(); s.stop();
