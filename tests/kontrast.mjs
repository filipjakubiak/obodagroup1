/* ==========================================================================
   Kontrast MIERZONY NA WYRENDEROWANEJ STRONIE, nie na tokenach.

   Ten test powstal po realnym bledzie: tokeny przechodzily 4.5:1, ale sekcja
   MEMS przygaszala tekst przez opacity 0.72-0.92 na czerwieni, ktora daje
   dokladnie 4.79:1. Kazde przygaszenie schodzilo ponizej progu, a test
   tokenow tego nie widzial, bo opacity nie jest kolorem.

   Tutaj chodzimy po realnych wezlach tekstowych, skladamy lancuch opacity
   i szukamy pierwszego nieprzezroczystego tla powyzej.
   ========================================================================== */
import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import { kontrast, sprawdz, wynik } from "./pomocniki.mjs";

const s = await startSerwera(4315);
const b = await chromium.launch();

for (const schemat of ["light", "dark"]) {
  const ctx = await b.newContext({ colorScheme: schemat, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(s.url, { waitUntil: "networkidle" });
  /* Przewijamy przez cala strone, zeby odslonic tresc chowana do animacji. */
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    scrollTo(0, 0);
  });
  await p.waitForTimeout(2500);

  const zle = await p.evaluate(() => {
    const wynik = [];

    /* 🚨 Kolory MUSZA byc sprowadzone do sRGB przez przegladarke.
       getComputedStyle zwraca to, co zapisano: color-mix oddaje
       "oklab(0.757 0.001 0.008)". Pierwsza wersja testu wycinala trzy
       pierwsze liczby i czytala 0.757 jako skladowa 0-255, czyli prawie
       czern - i zglaszala kontrast 1.12 tam, gdzie realnie bylo ponad 10.
       Malujemy kolor na plotnie i odczytujemy piksel: to dziala dla kazdego
       zapisu, ktory przegladarka rozumie. */
    const plotno = document.createElement("canvas");
    plotno.width = plotno.height = 1;
    const ctx2 = plotno.getContext("2d", { willReadFrequently: true });
    const pamiec = new Map();
    const doRgb = (kolor) => {
      if (pamiec.has(kolor)) return pamiec.get(kolor);
      ctx2.clearRect(0, 0, 1, 1);
      ctx2.fillStyle = "#000";
      ctx2.fillStyle = kolor;
      ctx2.fillRect(0, 0, 1, 1);
      const d = ctx2.getImageData(0, 0, 1, 1).data;
      const v = [d[0], d[1], d[2]];
      pamiec.set(kolor, v);
      return v;
    };

    const widoczny = (e) => {
      const r = e.getBoundingClientRect();
      return r.width > 2 && r.height > 2;
    };
    const alfa = (e) => {
      let a = 1, n = e;
      while (n && n.nodeType === 1) { a *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
      return a;
    };
    const tlo = (e) => {
      let n = e;
      while (n && n.nodeType === 1) {
        const bg = getComputedStyle(n).backgroundColor;
        const m = bg.match(/[\d.]+/g);
        if (m && (m.length < 4 || parseFloat(m[3]) > 0.9)) return bg;
        n = n.parentElement;
      }
      return "rgb(255,255,255)";
    };
    document.querySelectorAll("p, h1, h2, h3, h4, a, span, li, blockquote, button, figcaption").forEach((e) => {
      const tekst = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join("");
      if (tekst.length < 3 || !widoczny(e)) return;
      const st = getComputedStyle(e);
      if (st.visibility === "hidden" || st.display === "none") return;
      wynik.push({
        tekst: tekst.slice(0, 42),
        kolor: doRgb(st.color),
        tlo: doRgb(tlo(e)),
        alfa: +alfa(e).toFixed(3),
        rozmiar: parseFloat(st.fontSize),
        waga: st.fontWeight,
        klasa: (e.className || "").toString().split(/\s+/)[0],
      });
    });
    return wynik;
  });

  let bledy = 0;
  for (const w of zle) {
    const kol = w.kolor;
    const bg = w.tlo;
    if (!kol || !bg) continue;
    /* Skladamy alfe recznie: tekst przygaszony opacity realnie miesza sie z tlem. */
    const efekt = kol.map((c, i) => c * w.alfa + bg[i] * (1 - w.alfa));
    const k = kontrast(efekt, bg);
    /* WCAG: duzy tekst (>=24px, albo >=18.66px przy wadze >=700) ma prog 3:1. */
    const duzy = w.rozmiar >= 24 || (w.rozmiar >= 18.66 && Number(w.waga) >= 700);
    const prog = duzy ? 3 : 4.5;
    if (k < prog) {
      bledy++;
      if (bledy <= 6) console.log(`    ${k.toFixed(2)} < ${prog}  [${w.klasa}] "${w.tekst}" alfa=${w.alfa}`);
    }
  }
  sprawdz(`[${schemat}] kazdy tekst na stronie przechodzi prog WCAG (sprawdzono ${zle.length})`,
    bledy === 0, bledy + " niedoborow");
  await ctx.close();
}

await b.close();
s.stop();
wynik();
