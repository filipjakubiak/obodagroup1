/* ==========================================================================
   FINAŁ — ostatnia sekcja przed stopką.

   Duże wezwanie na ciemnym polu, po którym leniwie dryfują rozmyte plamy
   w pięciu kolorach metody. To jedyne miejsce na stronie, gdzie kolory
   występują razem — bo to jest podsumowanie: wszystkie role, jedna firma.

   Dwie decyzje wydajnościowe:
   1. Plamy poruszają się WYŁĄCZNIE przez `transform`. Animowanie pozycji
      tła albo gradientu wymusza przemalowanie całej warstwy w każdej
      klatce; transform idzie po karcie graficznej.
   2. Reakcja na kursor jest wygładzana własną pętlą, a nie ustawiana
      wprost z pozycji myszy. Bez wygładzenia plamy „przyklejają się"
      do kursora i efekt wygląda tanio zamiast sennie.
   ========================================================================== */

const MNIEJ_RUCHU = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function uruchomFinal(host) {
  if (!host) return;
  const plamy = [...host.querySelectorAll(".final__plama")];
  if (!plamy.length) return;

  /* Przy wyłączonym ruchu plamy zostają tam, gdzie postawił je CSS.
     Sekcja dalej jest kolorowa, tylko nic się nie rusza. */
  if (MNIEJ_RUCHU()) return;

  /* Docelowe przesunięcie od kursora i przesunięcie bieżące. Różnica
     między nimi jest doganiana po kawałku w każdej klatce - stąd wrażenie
     bezwładności. */
  let celX = 0;
  let celY = 0;
  let x = 0;
  let y = 0;
  let wKadrze = false;
  let klatka = null;

  /* Tylko prawdziwy kursor. Na dotyku nie ma czego śledzić, a nasłuch
     kosztowałby tyle samo. */
  const precyzyjny = matchMedia("(pointer: fine)").matches;

  if (precyzyjny) {
    host.addEventListener("pointermove", (e) => {
      const r = host.getBoundingClientRect();
      /* Zakres -1..1 od środka sekcji. */
      celX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      celY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    host.addEventListener("pointerleave", () => { celX = 0; celY = 0; });
  }

  const krok = () => {
    /* 0.04 to bardzo powolne doganianie - plamy reagują na kursor
       z wyraźnym opóźnieniem, jak coś ciężkiego w cieczy. */
    x += (celX - x) * 0.04;
    y += (celY - y) * 0.04;

    plamy.forEach((p, i) => {
      /* Każda plama reaguje inaczej i w przeciwnych kierunkach, więc cała
         grupa się rozsuwa i zsuwa zamiast przesuwać jak jeden obrazek. */
      const sila = (i % 2 ? -1 : 1) * (26 + i * 12);
      p.style.transform = `translate3d(${(x * sila).toFixed(2)}px, ${(y * sila).toFixed(2)}px, 0)`;
    });

    klatka = requestAnimationFrame(krok);
  };

  /* Pętla chodzi tylko wtedy, gdy sekcja jest na ekranie. Animacja
     poza kadrem to czysta strata prądu na telefonie. */
  const obs = new IntersectionObserver((wpisy) => {
    for (const w of wpisy) {
      if (w.isIntersecting && !wKadrze) {
        wKadrze = true;
        klatka = requestAnimationFrame(krok);
      } else if (!w.isIntersecting && wKadrze) {
        wKadrze = false;
        cancelAnimationFrame(klatka);
      }
    }
  }, { threshold: 0.05 });
  obs.observe(host);

  /* Przejście na inną kartę też zatrzymuje pętlę. */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(klatka);
    else if (wKadrze) klatka = requestAnimationFrame(krok);
  });

  return () => { cancelAnimationFrame(klatka); obs.disconnect(); };
}
