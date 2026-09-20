/* Odczyt pomaranczu prosto z pliku logotypu. */
import { chromium } from "playwright";
import fs from "node:fs";
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("about:blank");
const dane = "data:image/webp;base64," + fs.readFileSync("assets/marka/logo.webp").toString("base64");
const r = await p.evaluate(async (src) => {
  const img = new Image(); img.src = src; await img.decode();
  const c = document.createElement("canvas");
  c.width = img.width; c.height = img.height;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  const kub = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const [rr, gg, bb, a] = [d[i], d[i+1], d[i+2], d[i+3]];
    if (a < 220) continue;
    const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
    if (max === 0 || (max - min) / max < 0.5) continue;   /* tylko nasycone */
    const k = [rr, gg, bb].join(",");
    kub.set(k, (kub.get(k) || 0) + 1);
  }
  return [...kub.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([k, n]) => ({ hex: "#" + k.split(",").map(v => (+v).toString(16).padStart(2, "0")).join("").toUpperCase(), px: n }));
}, dane);
console.log(JSON.stringify(r, null, 1));
await b.close();
