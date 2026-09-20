/* Wspólne narzędzia testów. Kontrast liczymy, zamiast oceniać wzrokiem —
   to jedyny sposób, żeby żółty nigdy nie wszedł jako kolor tekstu. */

export function luminancja([r, g, b]) {
  const k = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
}

export function kontrast(a, b) {
  const [l1, l2] = [luminancja(a), luminancja(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export const naRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/* Kolor z przeglądarki przychodzi jako "rgb(20, 18, 16)" albo "rgba(...)". */
export function zCss(tekst) {
  const m = String(tekst).match(/-?\d+(\.\d+)?/g);
  return m ? m.slice(0, 3).map(Number) : null;
}

let ok = 0;
let zle = 0;

export function sprawdz(nazwa, warunek, extra = "") {
  if (warunek) { ok++; console.log("  OK   " + nazwa); }
  else { zle++; console.log("  ZLE  " + nazwa + (extra ? "  -> " + extra : "")); }
}

export function wynik() {
  console.log(`\nWYNIK: ${ok} OK, ${zle} ZLE`);
  /* process.exitCode, nigdy process.exit() — lekcja z Perun Tac: process.exit()
     po żądaniach sieciowych wywala node na Windows kodem 127 mimo zielonego wyniku. */
  process.exitCode = zle ? 1 : 0;
  return zle;
}

/* Myślnik i półpauza są zakazane w treści widocznej dla użytkownika.
   Sprawdzamy mechanicznie, bo przy przepisywaniu treści z WooCommerce
   wchodzą same — tytuły na starej stronie są ich pełne. */
export const MYSLNIKI = /[–—]/;

/* Strażnik integralności arkuszy.
   Powstał po realnym uszkodzeniu: edycja zostawiła w tokens.css osierocony
   tekst i nadmiarowy znacznik końca komentarza, przez co parser odrzucał
   deklaracje aż do odzyskania. Tokeny --na-* przestały działać, a test
   kontrastu pokazywał tajemnicze 3.46 zamiast policzonych 4.79.

   (Pierwsza wersja tego komentarza miała ten znacznik wpisany dosłownie
   i zamknęła sama siebie w połowie zdania. Stąd opis słowny.)

   Liczenie znaczników i klamer jest tanie i wyklucza całą klasę błędów,
   w której edycja psuje arkusz, a strona wygląda „prawie dobrze". */
import fs from "node:fs";
export function sprawdzArkusze(katalog, sprawdzFn) {
  for (const plik of fs.readdirSync(katalog).filter((f) => f.endsWith(".css"))) {
    const s = fs.readFileSync(katalog + "/" + plik, "utf8");
    const otw = (s.match(/\/\*/g) || []).length;
    const zam = (s.match(/\*\//g) || []).length;
    sprawdzFn(`${plik}: komentarze domkniete (${otw}/${zam})`, otw === zam, otw + " vs " + zam);
    const kl = (s.match(/\{/g) || []).length;
    const kp = (s.match(/\}/g) || []).length;
    sprawdzFn(`${plik}: klamry domkniete (${kl}/${kp})`, kl === kp, kl + " vs " + kp);
  }
}
