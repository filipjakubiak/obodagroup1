/* ==========================================================================
   HERO — maszyna osobowościowa.

   Nie zmienia się samo słowo. Zmienia się CAŁY EKRAN: grunt, kolor tekstu
   i tempo przejścia. Mariusz zostaje w kadrze czarno-biały przez cały czas —
   zmienia się kolor wokół niego. To jest dosłownie zdanie, które ta firma
   sprzedaje: ten sam człowiek, inny kolor, inna osobowość.

   Dwie rzeczy, na których stoi efekt:
   1. Słowo-rola wypełnia linię CO DO PIKSELA, rozciągając oś szerokości fontu
      (Archivo, wdth 62-125). Wiersz stoi nieruchomo, litery oddychają.
      Dopasowanie idzie bisekcją, nie wzorem — szerokość tekstu nie jest
      liniowa względem osi wdth.
   2. Każdy kolor ma własne tempo (--tempo-*). Czerwony przełącza się szybko
      i twardo, niebieski wolno i miękko. Temperament jest w ruchu.
   ========================================================================== */

const MIN = 62;
const MAX = 125;

/* Role i ich kolory. Kolejność jest celowa: zaczynamy od lekarza (rdzeń
   oferty, MEMS), kończymy na całym zespole — tak samo jak układ katalogu. */
export const ROLE = [
  { slowo: "lekarza",       pole: "pole--ogien" },
  { slowo: "rejestratorkę", pole: "pole--slonce" },
  { slowo: "higienistkę",   pole: "pole--kwas" },
  { slowo: "menedżera",     pole: "pole--chlod" },
  { slowo: "cały zespół",   pole: "pole--fiolet" },
];

const POLA = ROLE.map((r) => r.pole);

/* Bisekcja po osi szerokości. 12 kroków daje dokładność poniżej pół piksela,
   a jest tanie: każdy krok to jedno ustawienie stylu i jeden odczyt. */
function dopasuj(el, docelowa) {
  /* Pomiar MUSI iść z wyłączonym przejściem. Oś szerokości jest animowana
     (to jest właśnie cały efekt), więc getBoundingClientRect w trakcie
     animacji zwraca wartość pośrednią, a nie tę, którą przed chwilą
     ustawiliśmy. Bisekcja zbiegała wtedy do przypadkowej liczby i krótkie
     słowa nie wypełniały linii. Zdejmujemy przejście na czas pomiaru. */
  const bylo = el.style.transition;
  el.style.transition = "none";

  let lo = MIN;
  let hi = MAX;
  for (let i = 0; i < 14; i++) {
    const sr = (lo + hi) / 2;
    el.style.fontVariationSettings = `"wdth" ${sr}`;
    if (el.getBoundingClientRect().width < docelowa) lo = sr;
    else hi = sr;
  }
  const wynik = (lo + hi) / 2;

  /* Wymuszenie przeliczenia układu, zanim wróci przejście — inaczej
     przeglądarka sklei ostatni krok pomiaru z animacją i zobaczymy skok. */
  void el.offsetWidth;
  el.style.transition = bylo;
  return wynik;
}

export function uruchomHero(host) {
  const rola = host.querySelector(".hero__rola");
  const tytul = host.querySelector(".hero__tytul");
  if (!rola || !tytul) return;

  const mniejRuchu = matchMedia("(prefers-reduced-motion: reduce)");
  let i = 0;

  /* Docelowa szerokość to szerokość wiersza. Zdejmujemy wypełnienie, bo
     getBoundingClientRect mierzy razem z nim. */
  const dostepna = () => {
    const s = getComputedStyle(tytul);
    return tytul.getBoundingClientRect().width
      - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
  };

  const przelicz = () => dopasuj(rola, Math.max(120, dostepna()));

  /* Płachta zamiatająca. Jest jedna i wraca w kółko: dostaje kolor następnej
     osobowości, przejeżdża nad starym gruntem i po dojeździe oddaje mu swój
     kolor. Dzięki temu nigdy nie powstaje kolor pośredni. */
  const plachta = host.querySelector(".hero__plachta");

  /* Kolor gruntu czytamy z klasy przez zmienną --kolor, a nie z tablicy —
     paleta ma jedno źródło prawdy i jest nim CSS. */
  const kolorPola = (pole) => {
    const probka = document.createElement("div");
    probka.className = "pole " + pole;
    probka.style.cssText = "position:absolute;visibility:hidden";
    host.appendChild(probka);
    const k = getComputedStyle(probka).getPropertyValue("--kolor").trim();
    probka.remove();
    return k;
  };

  const ustawTresc = (n) => {
    const r = ROLE[n];
    rola.textContent = r.slowo;
    host.classList.remove(...POLA);
    host.classList.add(r.pole);
    przelicz();
  };

  const zamiec = (n) => {
    if (!plachta) { ustawTresc(n); return; }
    const r = ROLE[n];
    const tempo = parseFloat(getComputedStyle(host).getPropertyValue("--tempo")) || 760;

    plachta.style.setProperty("--plachta", kolorPola(r.pole));
    plachta.classList.remove("jedzie");
    void plachta.offsetWidth;            /* restart animacji */
    plachta.classList.add("jedzie");

    /* Tekst przeskakuje w połowie przejazdu — płachta zasłania wtedy już
       większość napisu, więc zmiany koloru liter nie widać. */
    setTimeout(() => ustawTresc(n), tempo * 0.5);

    /* Po dojeździe grunt jest już właściwy, więc płachtę chowamy bez
       animacji — inaczej przy następnym cyklu wyjeżdżałaby wstecz. */
    setTimeout(() => {
      plachta.classList.remove("jedzie");
      plachta.style.setProperty("--plachta", "transparent");
    }, tempo + 40);
  };

  ustawTresc(0);

  /* Pomiar przed dojściem fontu jest fałszywy: metryka zastępczego kroju jest
     inna i słowo rozjeżdża się w momencie podmiany. Stąd fonts.ready. */
  document.fonts.ready.then(przelicz);
  new ResizeObserver(przelicz).observe(tytul);

  /* Przy wyłączonym ruchu zostaje pierwszy stan. Strona jest wtedy kompletna
     i czytelna — po prostu nic nie miga. */
  if (mniejRuchu.matches) return;

  let stoi = false;
  const tik = () => {
    if (stoi || document.hidden) return;
    i = (i + 1) % ROLE.length;
    zamiec(i);
  };
  const licznik = setInterval(tik, 2800);

  /* Najazd na hero zatrzymuje karuzelę: jeśli ktoś czyta, nie wyrywamy mu
     zdania sprzed oczu. */
  host.addEventListener("pointerenter", () => { stoi = true; });
  host.addEventListener("pointerleave", () => { stoi = false; });

  return () => clearInterval(licznik);
}
