/* Rozbiór referencji: co się rusza, kiedy i jak. Nie kopiujemy — bierzemy język ruchu. */
import { chromium } from "playwright";
const URL = "https://www.theclimatepledge.com/us/en";
const OUT = "pledge-shots/";
import fs from "node:fs";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(2500);

/* 1. Jakie biblioteki animacji naprawdę żyją w oknie */
const biblioteki = await page.evaluate(() => {
  const k = Object.keys(window);
  return {
    globalne: k.filter((x) => /gsap|scrolltrigger|lenis|locomotive|barba|swiper|lottie|three|anime|motion|scrollmagic|aos/i.test(x)),
    maGsap: !!window.gsap, maLenis: !!window.Lenis, maSwiper: !!window.Swiper, maLottie: !!window.lottie,
  };
});
console.log("BIBLIOTEKI:", JSON.stringify(biblioteki));

/* 2. Szkielet sekcji: ile, jak wysokie, co w środku */
const sekcje = await page.evaluate(() => {
  const kand = [...document.querySelectorAll("main > *, main section, .cmp-container > .cmp-container")];
  const widziane = new Set();
  return kand.filter((e) => e.getBoundingClientRect().height > 180).slice(0, 24).map((e) => {
    const r = e.getBoundingClientRect();
    const h2 = e.querySelector("h1,h2,h3");
    return {
      tag: e.tagName.toLowerCase(),
      klasy: (e.className || "").toString().split(/\s+/).slice(0, 3).join(" "),
      wys: Math.round(r.height),
      naglowek: h2 ? h2.textContent.trim().replace(/\s+/g, " ").slice(0, 70) : "",
      obrazkow: e.querySelectorAll("img").length,
      video: e.querySelectorAll("video").length,
    };
  });
});
console.log("\nSEKCJE:");
sekcje.forEach((s) => console.log("  " + String(s.wys).padStart(5) + "px  " + (s.video ? "VIDEO " : "") + (s.obrazkow ? "img:" + s.obrazkow + " " : "") + (s.naglowek || "(" + s.klasy + ")")));

/* 3. Co ma zadeklarowane przejścia / animacje w CSS */
const ruch = await page.evaluate(() => {
  const licz = {};
  const przyklady = [];
  [...document.querySelectorAll("*")].slice(0, 4000).forEach((e) => {
    const s = getComputedStyle(e);
    if (s.transitionDuration !== "0s") {
      const k = s.transitionProperty + " | " + s.transitionDuration + " | " + s.transitionTimingFunction;
      licz[k] = (licz[k] || 0) + 1;
    }
    if (s.animationName !== "none") przyklady.push(s.animationName + " " + s.animationDuration + " " + s.animationTimingFunction);
    if (s.willChange !== "auto") przyklady.push("will-change: " + s.willChange);
  });
  return { przejscia: Object.entries(licz).sort((a, b) => b[1] - a[1]).slice(0, 12), animacje: [...new Set(przyklady)].slice(0, 12) };
});
console.log("\nPRZEJŚCIA CSS (najczęstsze):");
ruch.przejscia.forEach(([k, n]) => console.log("  ×" + String(n).padStart(4) + "  " + k));
console.log("ANIMACJE / will-change:", JSON.stringify(ruch.animacje, null, 1));

/* 4. Typografia i paleta — skala, nie wartości do kopiowania */
const styl = await page.evaluate(() => {
  const rodziny = {}, rozmiary = {}, kolory = {}, tla = {};
  [...document.querySelectorAll("h1,h2,h3,p,a,button,li")].slice(0, 1200).forEach((e) => {
    const s = getComputedStyle(e);
    if (!e.textContent.trim()) return;
    rodziny[s.fontFamily.split(",")[0].replace(/"/g, "")] = (rodziny[s.fontFamily.split(",")[0].replace(/"/g, "")] || 0) + 1;
    const key = e.tagName + " " + s.fontSize + "/" + s.lineHeight + " w" + s.fontWeight + " ls" + s.letterSpacing;
    rozmiary[key] = (rozmiary[key] || 0) + 1;
    kolory[s.color] = (kolory[s.color] || 0) + 1;
  });
  [...document.querySelectorAll("section,div,main,header,footer")].slice(0, 900).forEach((e) => {
    const b = getComputedStyle(e).backgroundColor;
    if (b !== "rgba(0, 0, 0, 0)") tla[b] = (tla[b] || 0) + 1;
  });
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
  return { rodziny: top(rodziny, 5), rozmiary: top(rozmiary, 14), kolory: top(kolory, 8), tla: top(tla, 8) };
});
console.log("\nFONTY:", JSON.stringify(styl.rodziny));
console.log("SKALA TYPO:"); styl.rozmiary.forEach(([k, n]) => console.log("  ×" + String(n).padStart(4) + "  " + k));
console.log("KOLORY TEKSTU:", JSON.stringify(styl.kolory));
console.log("TŁA:", JSON.stringify(styl.tla));

/* 5. Zrzuty przewijania — 6 klatek przez całą stronę */
const wysokosc = await page.evaluate(() => document.body.scrollHeight);
console.log("\nWYSOKOŚĆ STRONY:", wysokosc, "px =", (wysokosc / 900).toFixed(1), "ekranów");
for (let i = 0; i < 7; i++) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), Math.round((wysokosc - 900) * (i / 6)));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: OUT + "pledge-" + i + ".png" });
}
console.log("zrzuty: " + OUT);
await browser.close();
