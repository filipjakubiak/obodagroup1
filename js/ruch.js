/* ==========================================================================
   Wspólna mechanika ujawniania.

   Jedno miejsce, bo sekcje robią to samo i rozjechałyby się przy pierwszej
   poprawce. Trzy rzeczy, które ten plik musi gwarantować:

   1. Bez JavaScriptu treść jest widoczna. Stany startowe siedzą pod `.js`.
   2. Przy `prefers-reduced-motion` nic się nie rusza.
   3. 🚨 Treść ujawnia się ZAWSZE, nawet gdy obserwator nie zdąży.
      IntersectionObserver jest próbkowany co klatkę: przy szybkim przewijaniu
      albo skoku po kotwicy element potrafi przelecieć przez ekran bez
      zarejestrowania. Bez zabezpieczenia zostawałby na opacity 0, czyli
      tekst byłby po prostu niewidoczny. Wyłapał to dopiero test kontrastu,
      który zmierzył alfę 0 na wyrenderowanej stronie.
   ========================================================================== */

const MNIEJ_RUCHU = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Po tym czasie ujawniamy wszystko, co jeszcze zostało schowane. Wartość jest
   dłuższa niż jakakolwiek realna animacja wejścia i krótsza niż cierpliwość
   człowieka, który trafił na stronę z wyłączonym obserwatorem. */
const RATUNEK_MS = 2500;

export function ujawnij(elementy, { odstep = 110, prog = 0.24, klasa = "widoczna" } = {}) {
  const lista = [...elementy];
  if (!lista.length) return;

  const pokaz = (el) => el.classList.add(klasa);

  if (MNIEJ_RUCHU()) {
    lista.forEach(pokaz);
    return;
  }

  const obs = new IntersectionObserver((wpisy) => {
    for (const w of wpisy) {
      if (!w.isIntersecting) continue;
      const i = lista.indexOf(w.target);
      /* Kolejność, nie wszystko naraz: odstęp czyta się jak przedstawianie
         rzeczy po kolei, a nie jak jednoczesny przeskok. */
      setTimeout(() => pokaz(w.target), Math.max(0, i % 6) * odstep);
      obs.unobserve(w.target);
    }
  }, { threshold: prog });

  lista.forEach((el) => obs.observe(el));

  /* Zabezpieczenie. Nie zastępuje obserwatora — tylko domyka to, co przepadło. */
  setTimeout(() => {
    lista.forEach((el) => {
      if (!el.classList.contains(klasa)) { pokaz(el); obs.unobserve(el); }
    });
  }, RATUNEK_MS);
}
