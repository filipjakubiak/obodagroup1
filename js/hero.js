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
   1. Słowo-rola wypełnia linię CO DO PIKSELA, rozciągając oś szerokości
      fontu (Archivo, wdth 62-125). Wiersz stoi, litery oddychają.
   2. Każdy kolor ma własne tempo (--tempo-*). Czerwony przełącza się szybko
      i twardo, niebieski wolno i miękko. Temperament jest w ruchu.
   ========================================================================== */

const MIN = 62;
const MAX = 125;

export const ROLE = [
  { slowo: "lekarza",       pole: "pole--ogien",  opis: "MEMS i psychologia pracy z pacjentem" },
  { slowo: "rejestratorkę", pole: "pole--slonce", opis: "pierwsze trzydzieści sekund rozmowy" },
  { slowo: "higienistkę",   pole: "pole--kwas",   opis: "struktura wizyty i budowanie motywacji" },
  { slowo: "menedżera",     pole: "pole--chlod",  opis: "procesy, rekrutacja, rentowność" },
  { slowo: "cały zespół",   pole: "pole--fiolet", opis: "jeden standard dla całej praktyki" },
];

const POLA = ROLE.map((r) => r.pole);

/* Bisekcja po osi szerokości. */
function dopasuj(el, docelowa) {
  /* Pomiar MUSI iść z wyłączonym przejściem: oś jest animowana, więc
     getBoundingClientRect w trakcie animacji zwraca wartość pośrednią. */
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
  void el.offsetWidth;
  el.style.transition = bylo;
  return (lo + hi) / 2;
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

  /* Dopasowanie jest DWUSTOPNIOWE i drugi stopień jest konieczny.
     Sama oś szerokości daje tylko zakres 62-125 %, czyli mniej więcej
     dwukrotność. Krótkie słowo („LEKARZA") przy maksymalnej osi wypełniało
     linię w 72 %, a długie („REJESTRATORKĘ") przy minimalnej wystawało.
     Dlatego po bisekcji osi skalujemy jeszcze stopień pisma i bisekcję
     powtarzamy. Granice 0.72-1.5 pilnują, żeby wiersze nie rozjechały się
     między sobą wysokością. */
  const przeliczSlajd = (s) => {
    const rola = s.querySelector(".hero__rola");
    const tytul = s.querySelector(".hero__tytul");
    if (!rola || !tytul) return;

    const st = getComputedStyle(tytul);
    const dostepna = Math.max(120, tytul.getBoundingClientRect().width
      - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight));

    rola.style.fontSize = "";
    const bazowy = parseFloat(getComputedStyle(rola).fontSize);

    dopasuj(rola, dostepna);
    const po = rola.getBoundingClientRect().width;

    /* Poniżej 2 % różnicy nie ma czego poprawiać, a zmiana stopnia pisma
       kosztowałaby więcej, niż daje. */
    if (Math.abs(po - dostepna) / dostepna > 0.02) {
      const skala = Math.min(1.5, Math.max(0.72, dostepna / po));
      rola.style.fontSize = (bazowy * skala).toFixed(2) + "px";
      dopasuj(rola, dostepna);
    }
  };
  const przeliczWszystkie = () => slajdy.forEach(przeliczSlajd);

  przeliczWszystkie();
  /* Pomiar przed dojściem fontu jest fałszywy: metryka kroju zastępczego
     jest inna i słowo rozjeżdża się po podmianie. */
  document.fonts.ready.then(przeliczWszystkie);
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
