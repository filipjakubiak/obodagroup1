/* ==========================================================================
   Podstrony: zespół, wyjazdy, kontakt.
   Wszystkie renderują się z data/*.json, więc faza druga podmieni źródło,
   a nie układ.
   ========================================================================== */

import { pobierz, pole } from "./dane.js";
import { ujawnij } from "./ruch.js";
import { wyslij } from "./wyslij.js";

const el = (tag, klasa, tekst) => {
  const n = document.createElement(tag);
  if (klasa) n.className = klasa;
  if (tekst != null) n.textContent = tekst;
  return n;
};

/* ==========================================================================
   ZESPÓŁ
   ========================================================================== */

export async function zbudujZespol(host) {
  if (!host) return;
  const { osoby } = await pobierz("zespol");
  const lista = el("div", "zespol__lista");

  for (const o of osoby) {
    const art = el("article", `osoba pole pole--${o.kolor}`);

    const kadr = el("div", "osoba__kadr");
    const img = document.createElement("img");
    img.className = "osoba__foto";
    img.src = `./assets/zespol/${o.foto}`;
    img.alt = o.imie;
    img.width = o.foto_w;
    img.height = o.foto_h;
    img.loading = "lazy";
    kadr.appendChild(img);
    /* UJAWNIENIE: ten sam ruch co w sekcji Twój gabinet. Człowiek jest
       czarno-biały, kolor jego roli zalewa kadr od dołu. */
    kadr.appendChild(el("span", "osoba__zalew"));

    const tresc = el("div", "osoba__tresc");
    tresc.appendChild(el("p", "osoba__rola", pole(o, "rola")));
    tresc.appendChild(el("h2", "osoba__imie", o.imie));
    for (const akapit of o.bio_pl) tresc.appendChild(el("p", "osoba__bio", akapit));

    art.append(kadr, tresc);
    lista.appendChild(art);
  }

  host.appendChild(lista);
  ujawnij(lista.querySelectorAll(".osoba"), { odstep: 75, prog: 0.18 });
}

/* ==========================================================================
   WYJAZDY
   ========================================================================== */

export async function zbudujWyjazdy(host) {
  if (!host) return;
  const dane = await pobierz("wyjazdy");
  const lista = el("div", "wyjazdy__lista");

  /* Kolor jest tu tylko rytmem, nie znaczeniem: wyjazdy nie naleza do rol
     w gabinecie. Kolejnosc jest stala, wiec strona wyglada tak samo
     przy kazdym wejsciu. */
  const RYTM = ["ogien", "kwas", "slonce", "chlod", "fiolet"];

  dane.odbyte.forEach((w, i) => {
    const art = el("article", `wyjazd pole pole--${RYTM[i % RYTM.length]}`);

    const kadr = el("div", "wyjazd__kadr");
    const img = document.createElement("img");
    img.src = `./assets/wyjazdy/${w.foto}`;
    /* Zdjecia z wyjazdow to sklejki czterech kadrow z telefonu. Nadaja sie
       do kafelka, nigdy na pelny ekran - jakosc by tego nie udzwignela. */
    img.alt = `Zdjęcia z wyjazdu: ${pole(w, "kraj")}`;
    img.width = w.foto_w;
    img.height = w.foto_h;
    img.loading = "lazy";
    kadr.appendChild(img);

    /* Na zdjęciu ROK, nie nazwa kraju: nazwa stoi obok jako nagłówek
       i powtórzona byłaby szumem, a nie kolażem. Rok jest informacją,
       której obok nie ma, i od razu porządkuje pięć wyjazdów w czasie. */
    if (w.rok) kadr.appendChild(el("span", "wyjazd__napis", String(w.rok)));

    const tresc = el("div", "wyjazd__tresc");
    const kiedy = [pole(w, "termin"), w.rok].filter(Boolean).join(", ");
    if (kiedy) tresc.appendChild(el("span", "wyjazd__termin", kiedy));
    tresc.appendChild(el("h2", "wyjazd__kraj", pole(w, "kraj")));
    tresc.appendChild(el("p", "wyjazd__program", pole(w, "program")));
    tresc.appendChild(el("p", "wyjazd__opis", pole(w, "opis")));
    if (w.do_zatwierdzenia) tresc.appendChild(el("span", "znacznik", "opis do uzupełnienia"));

    /* Co drugi wyjazd ma zdjęcie po drugiej stronie — pięć jednakowych
       wierszy czytałoby się jak tabela. */
    if (i % 2) art.classList.add("wyjazd--odwrotnie");

    art.append(kadr, tresc);
    lista.appendChild(art);
  });

  host.appendChild(lista);

  /* Planowane wyjazdy: uczciwa zapowiedz zamiast przepisanego wypelniacza. */
  const p = dane.planowane;
  const blok = el("div", "wkrotce pole pole--fiolet");
  blok.appendChild(el("h2", "wkrotce__tytul", pole(p, "naglowek")));
  blok.appendChild(el("p", "wkrotce__tresc", pole(p, "tresc")));
  const a = el("a", "btn", "Napisz do Marleny");
  a.href = "mailto:marlena.majewska@oboda.pl";
  blok.appendChild(a);
  if (p.do_zatwierdzenia) blok.appendChild(el("span", "znacznik", "czeka na terminy od klienta"));
  host.appendChild(blok);

  ujawnij(lista.querySelectorAll(".wyjazd"), { odstep: 70, prog: 0.18 });
}

/* ==========================================================================
   KONTAKT
   ========================================================================== */

export async function zbudujKontakt(host) {
  if (!host) return;
  const [ustawienia, szk] = await Promise.all([pobierz("ustawienia"), pobierz("szkolenia")]);

  /* ---------- ludzie: kolaż z wycinanek ----------
     Trzy wycinane portrety na polach koloru, jak na ich własnych okładkach.
     Karta jest interaktywna: przycisk podstawia osobę do formularza niżej,
     zamiast kazać człowiekowi przepisywać adres. */
  const ludzie = el("ul", "ludzie");
  const KOLORY = ["slonce", "kwas", "chlod"];
  const kartyOsob = [];

  ustawienia.ludzie.forEach((o, i) => {
    const li = el("li", `czlowiek pole pole--${KOLORY[i % KOLORY.length]}`);

    const kadr = el("div", "czlowiek__kadr");
    const img = document.createElement("img");
    img.className = "czlowiek__foto";
    img.src = "./assets/zespol/" + o.foto;
    img.alt = o.imie;
    img.loading = "lazy";
    img.width = 470;
    img.height = 684;
    kadr.appendChild(img);
    li.appendChild(kadr);

    const tresc = el("div", "czlowiek__tresc");
    tresc.appendChild(el("p", "czlowiek__imie", o.imie));
    tresc.appendChild(el("p", "czlowiek__rola", pole(o, "rola")));

    const tel = el("a", "czlowiek__tel", o.telefon);
    tel.href = "tel:+48" + o.telefon.replace(/\s/g, "");
    tresc.appendChild(tel);

    const mail = el("a", "czlowiek__mail", o.email);
    mail.href = "mailto:" + o.email;
    tresc.appendChild(mail);

    /* Rodzaj gramatyczny z danych, nie zgadywany z imienia. Adrian jest
       jedynym mężczyzną w tej trójce, ale zgadywanie po imieniu to
       droga do wpadki przy pierwszej nowej osobie. */
    const wybierz = el("button", "czlowiek__wybierz",
      o.rodzaj === "m" ? "Napisz do niego" : "Napisz do niej");
    wybierz.type = "button";
    tresc.appendChild(wybierz);

    li.appendChild(tresc);
    ludzie.appendChild(li);
    kartyOsob.push({ li, wybierz, osoba: o });
  });
  host.appendChild(ludzie);

  /* ---------- formularz ---------- */
  const form = el("form", "form");
  form.noValidate = true;   /* walidujemy sami, żeby komunikat był po polsku i opisowy */

  const polaFormularza = [
    { id: "imie",  etykieta: "Imię i nazwisko", typ: "text",  wymagane: true, autocomplete: "name" },
    { id: "email", etykieta: "E-mail",          typ: "email", wymagane: true, autocomplete: "email" },
    { id: "tel",   etykieta: "Telefon",         typ: "tel",   wymagane: false, autocomplete: "tel" },
  ];

  for (const f of polaFormularza) {
    const grupa = el("div", "form__grupa");
    const lab = el("label", "form__etykieta", f.etykieta + (f.wymagane ? "" : " (opcjonalnie)"));
    lab.htmlFor = "f-" + f.id;
    const inp = document.createElement("input");
    inp.className = "form__pole";
    inp.id = "f-" + f.id;
    inp.name = f.id;
    inp.type = f.typ;
    inp.autocomplete = f.autocomplete;
    if (f.wymagane) inp.required = true;
    const blad = el("p", "form__blad");
    blad.id = "b-" + f.id;
    /* Pole wskazuje na swój komunikat, żeby czytnik ekranu przeczytał go
       razem z polem, a nie osobno gdzieś na końcu formularza. */
    inp.setAttribute("aria-describedby", blad.id);
    grupa.append(lab, inp, blad);
    form.appendChild(grupa);
  }

  /* Temat: lista grup szkoleń plus pozycje ogólne. */
  const gTemat = el("div", "form__grupa");
  const lTemat = el("label", "form__etykieta", "Czego dotyczy pytanie");
  lTemat.htmlFor = "f-temat";
  const sel = document.createElement("select");
  sel.className = "form__pole";
  sel.id = "f-temat";
  sel.name = "temat";
  for (const [wart, tekst] of [["ogolne", "Pytanie ogólne"], ["mems", "MEMS, cały cykl"]]) {
    const o = document.createElement("option");
    o.value = wart; o.textContent = tekst; sel.appendChild(o);
  }
  for (const g of szk.grupy) {
    const o = document.createElement("option");
    o.value = g.id; o.textContent = "Szkolenia: " + pole(g, "nazwa"); sel.appendChild(o);
  }
  gTemat.append(lTemat, sel);
  form.appendChild(gTemat);

  const gWiad = el("div", "form__grupa");
  const lWiad = el("label", "form__etykieta", "Wiadomość");
  lWiad.htmlFor = "f-wiadomosc";
  const ta = document.createElement("textarea");
  ta.className = "form__pole form__pole--dlugie";
  ta.id = "f-wiadomosc";
  ta.name = "wiadomosc";
  ta.rows = 5;
  ta.required = true;
  const bWiad = el("p", "form__blad");
  bWiad.id = "b-wiadomosc";
  ta.setAttribute("aria-describedby", bWiad.id);
  gWiad.append(lWiad, ta, bWiad);
  form.appendChild(gWiad);

  const zgoda = el("label", "form__zgoda");
  const chk = document.createElement("input");
  chk.type = "checkbox";
  chk.id = "f-zgoda";
  chk.name = "zgoda";
  chk.required = true;
  zgoda.append(chk, el("span", null,
    "Wiem, że moje dane posłużą do odpowiedzi na to zapytanie. Szczegóły w polityce prywatności."));
  const bZgoda = el("p", "form__blad");
  bZgoda.id = "b-zgoda";
  chk.setAttribute("aria-describedby", bZgoda.id);
  form.append(zgoda, bZgoda);

  const przycisk = el("button", "btn btn--gl", "Wyślij zapytanie");
  przycisk.type = "submit";
  form.appendChild(przycisk);

  const stan = el("p", "form__stan");
  stan.setAttribute("role", "status");
  stan.setAttribute("aria-live", "polite");
  form.appendChild(stan);

  /* W wersji demonstracyjnej formularz nie wysyła. Mówimy to wprost —
     nie wolno udawać przed klientem, że działa coś, czego nie ma. */
  const uwaga = el("p", "form__demo",
    "Wersja demonstracyjna: formularz sprawdza poprawność, ale nie wysyła jeszcze wiadomości. "
    + "Wysyłka wejdzie razem z zapleczem. Do tego czasu prosimy o kontakt mailem lub telefonem.");
  form.appendChild(uwaga);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    form.querySelectorAll(".form__blad").forEach((b) => { b.textContent = ""; });
    form.querySelectorAll(".form__pole, #f-zgoda").forEach((p) => p.removeAttribute("aria-invalid"));

    const bledy = [];
    const zglos = (id, tekst) => {
      bledy.push(id);
      const b = document.getElementById("b-" + id);
      if (b) b.textContent = tekst;
      const p = document.getElementById("f-" + id);
      if (p) p.setAttribute("aria-invalid", "true");
    };

    const v = (id) => (document.getElementById("f-" + id).value || "").trim();
    if (!v("imie")) zglos("imie", "Podaj imię i nazwisko, żebyśmy wiedzieli, do kogo piszemy.");
    /* Prosty warunek zamiast wyrafinowanego wzorca: adresy e-mail mają
       tyle poprawnych postaci, że ostry wzorzec odrzuca prawdziwe. */
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) zglos("email", "Ten adres e-mail wygląda na niepełny.");
    if (v("wiadomosc").length < 10) zglos("wiadomosc", "Napisz kilka zdań, inaczej trudno nam odpowiedzieć.");
    if (!chk.checked) zglos("zgoda", "Bez tej zgody nie możemy odpisać.");

    if (bledy.length) {
      stan.textContent = "Formularz ma " + bledy.length + (bledy.length === 1 ? " błąd." : " błędy.");
      document.getElementById("f-" + bledy[0]).focus();
      return;
    }

    przycisk.disabled = true;
    stan.textContent = "Wysyłam...";
    const odp = await wyslij("kontakt", Object.fromEntries(new FormData(form)));
    przycisk.disabled = false;
    stan.textContent = odp.demo
      ? "Sprawdzone poprawnie. W wersji demonstracyjnej wiadomość nie została wysłana."
      : "Dziękujemy, wiadomość poszła. Odpiszemy w ciągu dwóch dni roboczych.";
  });

  host.appendChild(form);

  /* ---------- wybór adresata ----------
     Kliknięcie w karcie człowieka podstawia adresata i przenosi do
     formularza. Bez tego trzeba przepisać adres z karty do własnej poczty,
     a tego nikt nie robi — pisze na ogólny i czeka dzień dłużej. */
  const doKogo = el("p", "form__adresat");
  doKogo.hidden = true;
  form.insertBefore(doKogo, form.firstChild);

  const mniejRuchu = matchMedia("(prefers-reduced-motion: reduce)");

  for (const { li, wybierz, osoba } of kartyOsob) {
    wybierz.addEventListener("click", () => {
      kartyOsob.forEach((k) => {
        const aktywna = k.li === li;
        k.li.classList.toggle("is-on", aktywna);
        k.wybierz.setAttribute("aria-pressed", String(aktywna));
      });

      doKogo.hidden = false;
      doKogo.textContent = "Wiadomość trafi do: " + osoba.imie + " (" + pole(osoba, "rola") + ").";
      /* Adresat trafia do ładunku formularza, więc faza druga dostanie go
         bez zmian w interfejsie. */
      form.dataset.adresat = osoba.email;

      form.scrollIntoView({ behavior: mniejRuchu.matches ? "auto" : "smooth", block: "start" });
      /* preventScroll, bo przewijaniem steruje scrollIntoView powyżej —
         bez tego przeglądarka skacze dwa razy. */
      document.getElementById("f-imie").focus({ preventScroll: true });
    });
  }

  /* Wejscie z karty szkolenia: ?szkolenie=<id> podpowiada temat i wiadomosc. */
  const id = new URL(location.href).searchParams.get("szkolenie");
  const s = id && szk.szkolenia.find((x) => x.id === id);
  if (s) {
    sel.value = s.grupa;
    ta.value = `Dzień dobry,\n\npiszę w sprawie szkolenia „${pole(s, "tytul")}". Proszę o informację o najbliższym terminie.`;
  }
}
