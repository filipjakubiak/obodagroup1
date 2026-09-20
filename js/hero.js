/* ==========================================================================
   HERO — maszyna osobowościowa jako suwak.

   Pięć ról na poziomym torze ze snapowaniem. Przewijasz w bok, a razem ze
   słowem zmienia się CAŁY EKRAN: grunt, kolor tekstu i tempo przejścia.
   Mariusz zostaje w kadrze czarno-biały przez cały czas — zmienia się kolor
   wokół niego. To jest dosłownie zdanie, które firma sprzedaje: ten sam
   człowiek, inny kolor, inna osobowość.

   Dlaczego natywny tor, a nie własna obsługa gestów:
   natywne przewijanie daje za darmo gładź, dotyk, pasek przewijania,
   klawisze strzałek po sfokusowaniu i bezwładność na telefonie. Własna
   implementacja tego wszystkiego jest gorsza i cięższa.

   Dwie rzeczy, na których stoi efekt:
   1. Słowo-rola wypełnia linię CO DO PIKSELA. Sofia Sans nie ma osi
      szerokości, więc dobieramy jedną z czterech szerokości rodziny
      (zwykła, semi condensed, condensed, extra condensed), a resztę
      dociągamy stopniem pisma. Wiersz stoi, słowo zawsze sięga krawędzi.
   2. Każdy kolor ma własne tempo (--tempo-*). Czerwony przełącza się szybko
      i twardo, niebieski wolno i miękko. Temperament jest w ruchu.
   ========================================================================== */

export const ROLE = [
  { slowo: "lekarza",       pole: "pole--ogien",  opis: "MEMS i psychologia pracy z pacjentem" },
  { slowo: "rejestratorkę", pole: "pole--slonce", opis: "pierwsze trzydzieści sekund rozmowy" },
  { slowo: "higienistkę",   pole: "pole--kwas",   opis: "struktura wizyty i budowanie motywacji" },
  { slowo: "menedżera",     pole: "pole--chlod",  opis: "procesy, rekrutacja, rentowność" },
  { slowo: "cały zespół",   pole: "pole--fiolet", opis: "jeden standard dla całej praktyki" },
];

const POLA = ROLE.map((r) => r.pole);

/* Cztery szerokosci Sofia Sans, od najszerszej do najwezszej. To NIE jest
   os wariacyjna, tylko cztery osobne rodziny - Sofia Sans nie ma osi wdth.
   Dobieramy rodzine tak, zeby slowo bylo jak najblizej docelowej szerokosci,
   a reszte dociagamy stopniem pisma. */
const SZEROKOSCI = ["--font-w-100", "--font-w-87", "--font-w-75", "--font-w-62"];

/* Granice skalowania stopnia. Ponizej 0.78 krotkie slowo bylo wyraznie
   mniejsze od wiersza "Szkolimy" i wiersze sie rozjezdzaly; powyzej 1.45
   dwa wiersze przestawaly miescic sie w ekranie. */
/* Szeroki zakres, bo bez osi szerokosci caly ciezar dopasowania spada na
   stopien pisma: "LEKARZA" musi urosnac ok. 2.5x wzgledem "REJESTRATORKI",
   zeby obie wypelnily te sama linie. Rozne stopnie miedzy slajdami nie
   przeszkadzaja - czlowiek nigdy nie widzi dwoch slajdow naraz. */
const SKALA_MIN = 0.5;
const SKALA_MAX = 3.0;

function zmienna(el, nazwa) {
  return getComputedStyle(el).getPropertyValue(nazwa).trim();
}

/* Dopasowanie slowa do linii: najpierw rodzina, potem stopien.
   Pomiar idzie z wylaczonym przejsciem, bo w trakcie animacji
   getBoundingClientRect zwraca wartosc posrednia. */
function dopasuj(el, docelowa) {
  const bylo = el.style.transition;
  el.style.transition = "none";
  el.style.fontSize = "";

  const bazowy = parseFloat(getComputedStyle(el).fontSize);

  /* Krok 1: rodzina, ktora przy bazowym stopniu jest najblizej celu
     i jeszcze go nie przekracza. Jesli nawet najszersza jest za waska
     (krotkie slowo), zostaje najszersza i robote konczy stopien. */
  let wybrana = SZEROKOSCI[0];
  for (const w of SZEROKOSCI) {
    el.style.fontFamily = zmienna(el, w);
    wybrana = w;
    if (el.getBoundingClientRect().width <= docelowa) break;
  }
  el.style.fontFamily = zmienna(el, wybrana);

  /* Krok 2: stopien pisma dociaga do linii co do piksela. */
  const po = el.getBoundingClientRect().width;
  if (po > 0 && Math.abs(po - docelowa) / docelowa > 0.005) {
    const skala = Math.min(SKALA_MAX, Math.max(SKALA_MIN, docelowa / po));
    el.style.fontSize = (bazowy * skala).toFixed(2) + "px";
  }

  void el.offsetWidth;
  el.style.transition = bylo;
  return wybrana;
}

export function uruchomHero(host) {
  const tor = host.querySelector(".hero__tor");
  const slajdy = [...host.querySelectorAll(".hero__slajd")];
  const plachta = host.querySelector(".hero__plachta");
  const kropki = host.querySelector(".hero__kropki");
  if (!tor || !slajdy.length) return;

  const mniejRuchu = matchMedia("(prefers-reduced-motion: reduce)");
  let biezacy = 0;
  let ruszone = false;   /* czy człowiek już dotknął suwaka */

  /* Kolor gruntu czytamy z klasy przez zmienną --kolor: paleta ma jedno
     źródło prawdy i jest nim CSS, nie tablica w JavaScripcie. */
  const kolorPola = (pole) => {
    const probka = document.createElement("div");
    probka.className = "pole " + pole;
    probka.style.cssText = "position:absolute;visibility:hidden";
    host.appendChild(probka);
    const k = getComputedStyle(probka).getPropertyValue("--kolor").trim();
    probka.remove();
    return k;
  };

  /* ---------- dopasowanie szerokości ---------- */

  const przeliczSlajd = (sl) => {
    const rola = sl.querySelector(".hero__rola");
    const tytul = sl.querySelector(".hero__tytul");
    if (!rola || !tytul) return;
    const st = getComputedStyle(tytul);
    const dostepna = Math.max(120, tytul.getBoundingClientRect().width
      - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight));
    dopasuj(rola, dostepna);
  };
  const przeliczWszystkie = () => slajdy.forEach(przeliczSlajd);

  przeliczWszystkie();

  /* Pomiar przed dojściem fontów jest bezwartościowy: metryka kroju
     zastępczego jest inna. Co więcej, przeglądarka pobiera krój dopiero
     wtedy, gdy jakiś element go używa - a trzy węższe rodziny pojawiają się
     wyłącznie w trakcie dopasowywania. Dlatego prosimy o nie WPROST. */
  const rodziny = SZEROKOSCI.map((w) => zmienna(document.documentElement, w).split(",")[0].replace(/"/g, "").trim());
  Promise.all(rodziny.map((r) => document.fonts.load('900 100px "' + r + '"').catch(() => null)))
    .then(() => document.fonts.ready)
    .then(przeliczWszystkie);
  new ResizeObserver(przeliczWszystkie).observe(tor);

  /* ---------- zmiana koloru całego ekranu ---------- */

  const ustawKolor = (n, odRazu = false) => {
    if (n === biezacy && !odRazu) return;
    const poprzedni = biezacy;
    biezacy = n;

    slajdy.forEach((s, i) => s.setAttribute("aria-current", String(i === n)));
    if (kropki) {
      [...kropki.children].forEach((k, i) => {
        k.classList.toggle("is-on", i === n);
        k.setAttribute("aria-current", String(i === n));
      });
    }

    if (odRazu || mniejRuchu.matches || !plachta) {
      host.classList.remove(...POLA);
      host.classList.add(ROLE[n].pole);
      return;
    }

    /* Zamiatanie zamiast przenikania: przenikanie pomarańczu w zieleń
       prowadzi przez brudne pośrednie, a na pełnym ekranie to widać.
       Płachta wjeżdża z tej strony, z której przyszedł człowiek. */
    const tempo = parseFloat(getComputedStyle(host).getPropertyValue("--tempo")) || 760;
    const zPrawej = n > poprzedni;
    plachta.style.setProperty("--plachta", kolorPola(ROLE[n].pole));
    plachta.style.clipPath = zPrawej ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
    void plachta.offsetWidth;
    plachta.classList.add("jedzie");

    setTimeout(() => {
      host.classList.remove(...POLA);
      host.classList.add(ROLE[n].pole);
    }, tempo * 0.5);

    setTimeout(() => {
      plachta.classList.remove("jedzie");
      plachta.style.setProperty("--plachta", "transparent");
    }, tempo + 40);
  };

  /* Kropki POWSTAJA PRZED pierwszym ustawieniem koloru. Odwrotna kolejnosc
     gubila oznaczenie aktywnej pozycji: ustawKolor probowal ja zaznaczyc,
     zanim istnialy. */
  if (kropki) {
    ROLE.forEach((r, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hero__kropka";
      b.innerHTML = '<span class="sr-only">Pokaz: szkolimy ' + r.slowo + '</span>';
      b.addEventListener("click", () => { ruszone = true; idzDo(i); });
      kropki.appendChild(b);
    });
  }

  ustawKolor(0, true);

  /* ---------- śledzenie, który slajd jest na ekranie ----------
     IntersectionObserver z torem jako korzeniem, nie nasłuch scrolla:
     nasłuch odpala się na każdej klatce i dławi telefon. */
  const obs = new IntersectionObserver((wpisy) => {
    for (const w of wpisy) {
      if (w.intersectionRatio > 0.6) ustawKolor(slajdy.indexOf(w.target));
    }
  }, { root: tor, threshold: [0.6] });
  slajdy.forEach((s) => obs.observe(s));

  /* ---------- sterowanie ---------- */

  const idzDo = (n) => {
    const i = Math.max(0, Math.min(ROLE.length - 1, n));
    tor.scrollTo({ left: slajdy[i].offsetLeft, behavior: mniejRuchu.matches ? "auto" : "smooth" });
  };

  /* Strzałki działają też wtedy, gdy fokus jest gdziekolwiek w hero —
     nie tylko na samym torze. */
  host.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    ruszone = true;
    idzDo(biezacy + (e.key === "ArrowRight" ? 1 : -1));
  });

  /* Pierwsze dotknięcie suwaka wyłącza automat na dobre. Kto przejął
     sterowanie, ten go ma — podbieranie mu kadru jest irytujące. */
  ["pointerdown", "wheel", "touchstart"].forEach((z) =>
    tor.addEventListener(z, () => { ruszone = true; }, { passive: true }));

  /* ---------- automat do pierwszego dotknięcia ----------
     Bez niego człowiek nie wie, że hero w ogóle się zmienia. Po dotknięciu
     milknie. Przy wyłączonym ruchu nie startuje wcale. */
  if (mniejRuchu.matches) return;
  const licznik = setInterval(() => {
    if (ruszone || document.hidden) { if (ruszone) clearInterval(licznik); return; }
    idzDo((biezacy + 1) % ROLE.length);
  }, 3200);

  return () => clearInterval(licznik);
}
