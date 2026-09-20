/* ==========================================================================
   TWÓJ GABINET — serce strony.

   Obecna strona wysypuje 38 produktów na głowę i zostawia odwiedzającego
   samego. Ta sekcja pokazuje praktykę jako pięcioro ludzi i dopiero stąd
   prowadzi do katalogu: najpierw „kto", potem „co".

   Ruch-podpis UJAWNIENIE: zdjęcie jest czarno-białe, a przy wejściu w ekran
   kolor grupy zalewa je od dołu. Ten sam zabieg co w hero, ta sama myśl —
   człowiek zostaje, kolor się zmienia.
   ========================================================================== */

import { pobierz, pole } from "./dane.js";

/* Zdjęcie dla każdej grupy — z ich własnych materiałów, nie ze stocku. */
const FOTO = {
  lekarz:  { plik: "mems/psychologia-motywacji-cover.webp", w: 1728, h: 1608 },
  pacjent: { plik: "kursy/opiekun-pacjenta-1.webp",         w: 831,  h: 1714 },
  kontakt: { plik: "kursy/rejestratorka-cz-1.webp",         w: 1821, h: 1073 },
  zarzad:  { plik: "kursy/az-1.webp",                       w: 1049, h: 1623 },
  zespol:  { plik: "mems/przekonania-cover.webp",           w: 1680, h: 1633 },
};

const el = (tag, klasa, tekst) => {
  const n = document.createElement(tag);
  if (klasa) n.className = klasa;
  if (tekst != null) n.textContent = tekst;
  return n;
};

export async function zbudujGabinet(host) {
  if (!host) return;
  const { grupy, szkolenia } = await pobierz("szkolenia");

  const lista = el("ul", "gabinet__lista");

  for (const g of grupy) {
    const ile = szkolenia.filter((s) => s.grupa === g.id).length;
    const foto = FOTO[g.id];

    const karta = el("li", `gabinet__karta pole pole--${g.kolor}`);
    /* Ostatnia grupa („cały zespół") idzie przez całą szerokość: to jedyne
       szkolenia, na których wszystkie role spotykają się przy jednym stole. */
    if (g.id === "zespol") karta.classList.add("gabinet__karta--pelna");

    const link = el("a", "gabinet__link");
    link.href = `./szkolenia.html?grupa=${g.id}`;

    const kadr = el("span", "gabinet__kadr");
    if (foto) {
      const img = document.createElement("img");
      img.className = "gabinet__foto";
      img.src = `./assets/${foto.plik}`;
      img.width = foto.w;
      img.height = foto.h;
      img.loading = "lazy";
      img.alt = "";
      kadr.appendChild(img);
      /* Warstwa koloru leży NAD zdjęciem i jest odsłaniana przez clip-path.
         Mieszanie „multiply" barwi, zamiast zakrywać — dzięki temu widać
         dalej człowieka, tylko już w kolorze jego roli. */
      kadr.appendChild(el("span", "gabinet__zalew"));
    }

    const tresc = el("span", "gabinet__tresc");
    tresc.appendChild(el("span", "gabinet__haslo", pole(g, "haslo")));
    tresc.appendChild(el("span", "gabinet__nazwa", pole(g, "nazwa")));
    tresc.appendChild(el("span", "gabinet__opis", pole(g, "opis")));
    tresc.appendChild(el("span", "gabinet__ile", ile === 1 ? "1 szkolenie" : `${ile} szkoleń`));

    link.append(kadr, tresc);
    karta.appendChild(link);
    lista.appendChild(karta);
  }

  host.appendChild(lista);
  ujawnij(lista);
}

/* UJAWNIENIE. IntersectionObserver, nie nasłuch scrolla — nasłuch odpala się
   na każdej klatce i dławi telefon. */
function ujawnij(zakres) {
  const mniejRuchu = matchMedia("(prefers-reduced-motion: reduce)");
  const karty = [...zakres.querySelectorAll(".gabinet__karta")];

  if (mniejRuchu.matches) {
    karty.forEach((k) => k.classList.add("widoczna"));
    return;
  }

  const obs = new IntersectionObserver((wpisy) => {
    wpisy.forEach((w) => {
      if (!w.isIntersecting) return;
      /* Kolejność, nie wszystko naraz: 110 ms odstępu czyta się jak
         przedstawianie ludzi po kolei. */
      const i = karty.indexOf(w.target);
      setTimeout(() => w.target.classList.add("widoczna"), Math.max(0, i) * 110);
      obs.unobserve(w.target);
    });
  }, { threshold: 0.24 });

  karty.forEach((k) => obs.observe(k));
}
