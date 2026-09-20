/* Wyciągnięcie realnej palety z okładek modułów. Renderujemy plik w przeglądarce,
   czytamy piksele i grupujemy w kubełki. Interesują nas tylko kolory NASYCONE -
   czerń, biel i szarości to portret, nie paleta. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const KAT = "C:/Users/filip/Desktop/neststudio/obodagroup/_scrape/assets-pelne/";
const PLIKI = [
  "psychologia-motywacji-cover.webp", "przekonania-cover.webp", "przywodztwo-cover.webp",
  "kolorowe-ja-cover.webp", "emocje-cover.webp", "szkolenie-zamkniete-cover.webp",
  "szkolenia-certyfikacyjne-cover.webp", "kontakt-hero.webp", "shop-hero.webp",
  "tasma-orange.webp", "tasma-green.webp", "tasma-blue.webp",
  "rejestratorka-cz-1.webp", "higienistki-1.webp", "az-1.webp", "opiekun-pacjenta-1.webp",
];

const b = await chromium.launch();
const p = await b.newPage();
await p.goto("about:blank");

for (const f of PLIKI) {
  const pelna = path.join(KAT, f);
  if (!fs.existsSync(pelna)) { console.log(f + "  BRAK"); continue; }
  const dane = "data:image/" + (f.endsWith(".png") ? "png" : "webp") + ";base64," + fs.readFileSync(pelna).toString("base64");
  const wynik = await p.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement("canvas");
    const S = 180;
    c.width = S; c.height = Math.round(S * img.height / img.width);
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0, c.width, c.height);
    const d = g.getImageData(0, 0, c.width, c.height).data;
    const kub = new Map();
    for (let i = 0; i < d.length; i += 4) {
      const [r, gg, bb, a] = [d[i], d[i + 1], d[i + 2], d[i + 3]];
      if (a < 200) continue;
      const max = Math.max(r, gg, bb), min = Math.min(r, gg, bb);
      const nasyc = max === 0 ? 0 : (max - min) / max;
      /* Tylko realne kolory: mocno nasycone i nie za ciemne. */
      if (nasyc < 0.45 || max < 90) continue;
      const k = [r, gg, bb].map((v) => Math.round(v / 24) * 24).join(",");
      kub.set(k, (kub.get(k) || 0) + 1);
    }
    const suma = [...kub.values()].reduce((a, b) => a + b, 0) || 1;
    return [...kub.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
      .map(([k, n]) => {
        const [r, g2, b2] = k.split(",").map(Number);
        const hex = "#" + [r, g2, b2].map((v) => Math.min(255, v).toString(16).padStart(2, "0")).join("");
        return hex + " " + (100 * n / suma).toFixed(0) + "%";
      });
  }, dane);
  console.log(f.replace(".webp", "").padEnd(42) + wynik.join("  "));
}
await b.close();
