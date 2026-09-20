# OBODA GROUP — faza 1 (wizualna) — plan wdrożenia

---

# 🔖 STAN SESJI — zapisane 2026-09-20 (koniec sesji)

> **Czytać jako pierwsze po wznowieniu.** Plan niżej opisuje, co było
> zamierzone; ta sekcja opisuje, co naprawdę stoi.

## Gdzie jesteśmy

**Faza 1 jest zbudowana w całości i wypchnięta.**
Repozytorium: **https://github.com/filipjakubiak/obodagroup1**, gałąź `main`,
18 commitów, 133 pliki, wszystko zsynchronizowane z `origin`.

```
npm run dev     # http://127.0.0.1:4310/obodagroup/
npm test        # siedem pakietow, 183 sprawdzenia
npm run build   # przebudowa data/*.json i stron z generatora
```

⚠️ **Nie edytować plików .html ręcznie** — generuje je `tools/zbuduj-strony.mjs`.

## ⛔ Jedyna rzecz, która czeka na Filipa

**Włączyć GitHub Pages:** Settings → Pages → Source: `main`, katalog `/ (root)`.
Strona pojawi się pod `https://filipjakubiak.github.io/obodagroup1/`.
Repozytorium jest publiczne właśnie po to (Pages na darmowym koncie inaczej
nie działa). Test `wdrozenie.mjs` już sprawdza, że nic się nie wysypie:
serwer deweloperski podaje stronę pod `/obodagroup/`, dokładnie tak jak Pages.

## Co powstało poza planem

Plan zakładał 13 zadań i rytm sekcji z § 9 specu. W trakcie Filip dołożył
sporo kierunków i tak wygląda różnica:

| Plan mówił | Jest |
|---|---|
| Hero z kinetyczną rolą (automat) | **Suwak** sterowany przewijaniem w bok, automat tylko do pierwszego dotknięcia |
| Archivo Variable (oś szerokości) | **Sofia Sans** na prośbę Filipa. Nie ma osi szerokości, więc dopasowanie idzie przez cztery szerokości rodziny + stopień pisma |
| Paleta Insights Discovery | **Kolory odczytane z ich własnych materiałów**, pomarańcz `#EE7F00` prosto z pliku logotypu |
| GSAP + ScrollTrigger + Lenis | **Nieużyte.** Żaden efekt tego nie potrzebował — sprostowanie w § 7.3 specu |
| Liczby w rzędzie, opinie w siatce | **Dwa bento** o różnych wysokościach |
| MEMS jako blok koloru | **Biały** w obu trybach, duże nieprzycinane okładki, tekst obok |
| Ceny jako trzy kwoty | **Proces zakupu** w czterech krokach + porównanie kosztu całkowitego |
| — | **Sekcja finałowa** z pięcioma dryfującymi plamami koloru |

## Pakiety testów (`npm test`)

| plik | co pilnuje |
|---|---|
| `fundament` | tokeny, kontrasty obu trybów, integralność arkuszy CSS |
| `kontrast` | 172 węzły tekstowe na wyrenderowanej stronie, z łańcuchem przezroczystości |
| `piksele` | kontrast na **wymalowanych pikselach** pod sekcją finałową |
| `dotyk` | cele dotykowe ≥ 44 px na sześciu stronach przy 390 px |
| `katalog` | filtr, stan w adresie, strona szczegółu |
| `strony` | osiem stron, formularz, brak wypełniacza, praca bez JS |
| `wdrozenie` | ścieżki względne, zero 404, sitemap |

## Trzy rzeczy, które warto pamiętać przy dotykaniu tego kodu

1. **Test, który nie pada przy zmianie, nie jest testem.** Pierwsza wersja
   `fundament.mjs` miała hexy wpisane z ręki i po przebudowie palety dalej
   świeciła na zielono. Teraz czyta wartości prosto z `tokens.css`.
2. **Zwykły test kontrastu nie widzi wymalowanych pikseli.** Nad sekcją
   z plamami koloru czyta tło sekcji i przepuszcza wszystko. Stąd osobny
   `piksele.mjs`.
3. **Zielony pakiet nie mówi nic o wyglądzie.** Większość realnych błędów
   w tej sesji złapały zrzuty, nie testy: portret jako negatyw, cudzysłów
   na drugim wierszu cytatu, tytuł hero łapiący `p { max-width: 68ch }`.

## Co czeka na klienta

`README.md` ma gotową listę **12 braków** (opinie, logotypy klinik,
potwierdzenie liczb, prawdziwe terminy wyjazdów, zdjęcia w wyższej
rozdzielczości, tłumaczenia EN). Wszystkie te miejsca są **zbudowane
i oznaczone na stronie** plakietką, nic nie zostało zmyślone.

`NOTATKI-LOKALNE.md` (**poza repozytorium**) ma pełną listę wypełniacza
z ich obecnej strony — do przekazania prywatnie, nie przez publiczne repo.

## Faza 2, gdy klient kupi koncepcję

Architektura jest pod to przygotowana:
- treść siedzi w `data/*.json`, więc podmiana źródła na API nie rusza układu
- `js/wyslij.js` to **jedyne miejsce**, które trzeba zmienić, żeby formularz
  zaczął wysyłać
- sklep (koszyk, płatności, konta) nie był budowany i jest świadomie poza zakresem

---


> **Dla wykonawcy:** WYMAGANY PODSKILL: `superpowers:subagent-driven-development` (zalecane)
> albo `superpowers:executing-plans`. Kroki mają `- [ ]` do odhaczania.

**Cel:** Statyczny serwis Oboda Group na GitHub Pages, którego zadaniem jest sprzedać klientowi
koncepcję re‑designu — kompletny wizualnie, z prawdziwymi treściami ze starej strony.

**Architektura:** Czysty HTML/CSS/JS bez frameworka i bez kroku budowania. Treść w `data/*.json`
renderowana po stronie przeglądarki, żeby faza 2 (backend) podmieniła tylko źródło danych.
Wszystkie ścieżki względne — serwis musi działać zarówno w korzeniu domeny, jak i pod `/obodagroup/`.

**Stack:** HTML5, CSS (custom properties, `clamp`, `clip-path`), vanilla JS (ES2020),
GSAP 3 + ScrollTrigger + Lenis z CDN, Google Fonts (Archivo Variable, Inter Tight),
Playwright do weryfikacji.

**Spec:** `docs/superpowers/specs/2026-09-20-obodagroup-redesign-design.md` — czytać razem z tym planem.

## Ograniczenia globalne

Dotyczą **każdego** zadania, nie powtarzam ich w krokach:

- **Ścieżki wyłącznie względne.** `./css/x.css`, nigdy `/css/x.css`. Dotyczy CSS, JS, obrazów, linków.
- **Jedno easing:** `cubic-bezier(0.65, 0, 0.35, 1)`. Trzy czasy: `200ms` / `420ms` / `760ms`.
- **Żółty `#FFC72C` nigdy nie jest kolorem tekstu.** Wyłącznie pole z tekstem `--ink`.
- **Jedna sekcja = jeden kolor akcentu.** Dwa kolory w jednej sekcji to błąd.
- **Kontrast:** tekst ≥ 4.5:1, elementy interaktywne ≥ 3:1. Mierzony, nie oceniany wzrokiem.
- **Jeden `<h1>` na stronę**, hierarchia nagłówków bez przeskoków.
- **`prefers-reduced-motion: reduce` wyłącza każdą transformację.** Bez wyjątków.
- **Bez JS strona jest kompletna i czytelna.** Treść jest w DOM widoczna domyślnie; klasy ukrywające
  dokłada JS dopiero po starcie (`document.documentElement.classList.add("js")`).
- **Zero poziomego przewijania przy 390 px** na każdej stronie.
- **Język interfejsu i kodu: polski.** Nazwy klas, funkcji i plików po polsku, jak w Perun Tac.
- Obrazy `.webp`, jawne `width`/`height`, `loading="lazy"` poza pierwszym ekranem.

---

## Struktura plików

| plik | odpowiedzialność |
|---|---|
| `css/tokens.css` | wyłącznie custom properties: kolory, skala typo, odstępy, easing, czasy |
| `css/base.css` | reset, typografia bazowa, `body`, fokus, selekcja |
| `css/uklad.css` | siatka, kontenery, powłoka (nagłówek, stopka), rytm sekcji |
| `css/komponenty.css` | przyciski, karty, pola formularza, plakietki, licznik |
| `css/ruch.css` | stany początkowe animacji + cały blok `prefers-reduced-motion` |
| `js/dane.js` | wczytanie `data/*.json`, jedno API dla reszty (`pobierz(nazwa)`) |
| `js/ruch.js` | rejestracja GSAP/Lenis, UJAWNIENIE, MASKA WIERSZA, LICZNIK, MAGNES |
| `js/hero.js` | wyłącznie kinetyczna rola (oś szerokości) |
| `js/katalog.js` | filtr i render katalogu szkoleń + strona szczegółu |
| `js/wyslij.js` | adapter formularzy — jedyne miejsce, które zmieni faza 2 |
| `js/main.js` | spięcie: powłoka, nawigacja, przełącznik języka, start modułów |
| `data/*.json` | treść (§ 7.1 specu) |
| `tests/*.mjs` | weryfikacja Playwrightem |

Podział jest **wg odpowiedzialności, nie wg warstwy**: `hero.js` jest osobno od `ruch.js`, bo
kinetyczna rola to jedyny mechanizm liczący szerokość tekstu i będzie się zmieniał niezależnie.

---

## Zadanie 1: Fundament — tokeny, baza, uprząż testowa

**Pliki:**
- Utworzyć: `package.json`, `css/tokens.css`, `css/base.css`, `index.html` (szkielet),
  `tests/pomocniki.mjs`, `tests/fundament.mjs`, `.nojekyll`
- Utworzyć: `README.md`

**Interfejsy:**
- Produkuje: wszystkie custom properties z § 6.2 i § 6.1 specu; `tests/pomocniki.mjs` eksportuje
  `kontrast(rgb1, rgb2) → number`, `startSerwera(port) → {url, stop}`, `sprawdz(nazwa, ok, extra)`.

- [ ] **Krok 1: `package.json` z serwerem statycznym na podkatalogu**

Serwer MUSI podawać stronę pod `/obodagroup/`, bo tak zachowa się GitHub Pages.
To nie jest wygoda — to warunek wykrycia błędu ścieżek bezwzględnych.

```json
{
  "name": "obodagroup",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node tools/serwer.mjs",
    "test": "node tests/fundament.mjs && node tests/strony.mjs && node tests/ruch.mjs"
  },
  "devDependencies": { "playwright": "^1.48.0" }
}
```

- [ ] **Krok 2: `tools/serwer.mjs` — statyk pod `/obodagroup/`**

```js
/* Serwer testowy. Montuje katalog projektu pod /obodagroup/, dokładnie tak,
   jak zrobi to GitHub Pages dla repozytorium projektowego. Dzięki temu każda
   ścieżka bezwzględna w kodzie wywala się tutaj, a nie dopiero po wdrożeniu. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const KORZEN = path.resolve(import.meta.dirname, "..");
const BAZA = "/obodagroup";
const TYPY = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml" };

export function startSerwera(port = 4310) {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (!p.startsWith(BAZA)) { res.writeHead(404).end("poza bazą"); return; }
    p = p.slice(BAZA.length) || "/";
    if (p.endsWith("/")) p += "index.html";
    const plik = path.join(KORZEN, p);
    if (!plik.startsWith(KORZEN) || !fs.existsSync(plik) || fs.statSync(plik).isDirectory()) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("404 " + p);
      return;
    }
    res.writeHead(200, { "content-type": TYPY[path.extname(plik)] || "application/octet-stream" });
    fs.createReadStream(plik).pipe(res);
  });
  return new Promise((ok) => srv.listen(port, () => ok({ url: `http://127.0.0.1:${port}${BAZA}/`, stop: () => srv.close() })));
}
if (import.meta.filename === process.argv[1]) startSerwera().then((s) => console.log("serwer:", s.url));
```

- [ ] **Krok 3: `css/tokens.css` — wyłącznie zmienne, zero reguł**

```css
/* OBODA GROUP — tokeny. Jedyny plik, w którym wolno zdefiniować wartość koloru,
   rozmiaru albo czasu. Wszystko inne odwołuje się do tych zmiennych. */
:root {
  /* baza */
  --ink:       #141210;
  --paper:     #F4F1EB;
  --ink-dim:   #6B655C;
  --line:      rgba(20, 18, 16, 0.14);
  --line-jasna: rgba(244, 241, 235, 0.18);

  /* cztery kolory metody — kolor = rola w gabinecie */
  --ogien:  #E4002B;   /* lekarz */
  --ziemia: #00A758;   /* przy pacjencie */
  --slonce: #FFC72C;   /* pierwszy kontakt — NIGDY jako kolor tekstu */
  --chlod:  #0076BF;   /* zarządzanie */

  /* typografia */
  --font-display: "Archivo", "Arial Narrow", sans-serif;
  --font-tekst:   "Inter Tight", system-ui, sans-serif;
  --t-display-xl: clamp(3.5rem, 11vw, 13rem);
  --t-display-l:  clamp(2.5rem, 7vw, 7rem);
  --t-display-m:  clamp(1.9rem, 4vw, 3.5rem);
  --t-lead:       clamp(1.15rem, 1.6vw, 1.5rem);
  --t-body:       1.0625rem;
  --t-meta:       0.8125rem;

  /* przestrzeń */
  --max:      1440px;
  --margines: clamp(20px, 5vw, 80px);
  --sekcja:   clamp(96px, 14vh, 200px);
  --rynna:    24px;

  /* ruch — jedno easing, trzy czasy */
  --ease:  cubic-bezier(0.65, 0, 0.35, 1);
  --t-mikro:   200ms;
  --t-stan:    420ms;
  --t-odslona: 760ms;
}
```

- [ ] **Krok 4: `css/base.css`**

Reset (`* { margin:0; padding:0; box-sizing:border-box }`), `body` na `--paper`/`--ink`
z `--font-tekst`, `h1–h6` na `--font-display` z `line-height: .92` i `letter-spacing: -.03em`,
`p { max-width: 68ch }`, `:focus-visible { outline: 3px solid var(--ogien); outline-offset: 3px }`,
`::selection`, `img { display:block; max-width:100% }`, `html { scroll-behavior: smooth }`
wyłączone przy `prefers-reduced-motion`.

- [ ] **Krok 5: `index.html` — szkielet z fontami i `.nojekyll`**

`<html lang="pl">`, `preconnect` do `fonts.googleapis.com` i `fonts.gstatic.com`, jeden `<link>`
do `https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Inter+Tight:wght@400;500;600&display=swap`,
trzy `<link rel="stylesheet">` do tokens/base/uklad w tej kolejności. W `<body>` na razie
`<h1>Oboda Group</h1>`. Plik `.nojekyll` w korzeniu (GitHub Pages inaczej pomija katalogi z `_`).

- [ ] **Krok 6: `tests/pomocniki.mjs` — liczenie kontrastu i wynik**

```js
/* Kontrast WCAG 2.1. Liczymy, zamiast oceniać wzrokiem — to jedyny sposób,
   żeby żółty nie wszedł kiedyś jako kolor tekstu. */
export function luminancja([r, g, b]) {
  const k = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
}
export function kontrast(a, b) {
  const [l1, l2] = [luminancja(a), luminancja(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
export const naRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
let ok = 0, zle = 0;
export function sprawdz(nazwa, warunek, extra = "") {
  if (warunek) { ok++; console.log("  OK   " + nazwa); }
  else { zle++; console.log("  ŹLE  " + nazwa + (extra ? "  -> " + extra : "")); }
}
export function wynik() { console.log(`\nWYNIK: ${ok} OK, ${zle} ŹLE`); process.exitCode = zle ? 1 : 0; return zle; }
```

⚠️ `process.exitCode`, nigdy `process.exit()` — lekcja z Perun Tac: `process.exit()` po żądaniach
sieciowych wywala node na Windows kodem 127 mimo zielonego wyniku.

- [ ] **Krok 7: `tests/fundament.mjs` — pierwszy test, ma paść**

```js
import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import { kontrast, naRgb, sprawdz, wynik } from "./pomocniki.mjs";

console.log("== fundament ==");
sprawdz("ink na paper ≥ 4.5:1", kontrast(naRgb("#141210"), naRgb("#F4F1EB")) >= 4.5,
  kontrast(naRgb("#141210"), naRgb("#F4F1EB")).toFixed(2));
sprawdz("ink-dim na paper ≥ 4.5:1", kontrast(naRgb("#6B655C"), naRgb("#F4F1EB")) >= 4.5,
  kontrast(naRgb("#6B655C"), naRgb("#F4F1EB")).toFixed(2));
sprawdz("ogien na paper ≥ 4.5:1", kontrast(naRgb("#E4002B"), naRgb("#F4F1EB")) >= 4.5,
  kontrast(naRgb("#E4002B"), naRgb("#F4F1EB")).toFixed(2));
sprawdz("ink na slonce ≥ 4.5:1 (żółty tylko jako pole)", kontrast(naRgb("#141210"), naRgb("#FFC72C")) >= 4.5,
  kontrast(naRgb("#141210"), naRgb("#FFC72C")).toFixed(2));
sprawdz("slonce jako TEKST na paper jest nieczytelny — dlatego zakazany",
  kontrast(naRgb("#FFC72C"), naRgb("#F4F1EB")) < 3);

const s = await startSerwera(4310);
const b = await chromium.launch();
const p = await b.newPage();
const bledy = [];
p.on("pageerror", (e) => bledy.push(String(e)));
p.on("response", (r) => { if (r.status() >= 400) bledy.push(r.status() + " " + r.url()); });
await p.goto(s.url, { waitUntil: "networkidle" });
sprawdz("strona wstaje pod /obodagroup/ bez 404 i bez błędów JS", bledy.length === 0, bledy.join(" | "));
sprawdz("font display doszedł", await p.evaluate(() => document.fonts.check("1em Archivo")));
await b.close(); s.stop(); wynik();
```

- [ ] **Krok 8: uruchomić test, potwierdzić że pada**

```bash
cd obodagroup && npm install && npm run test 2>&1 | tail -20
```
Oczekiwane: padają testy odwołujące się do jeszcze nieistniejących plików.

- [ ] **Krok 9: doprowadzić do zieleni**

Jeśli któryś kontrast nie wychodzi — **poprawić token, nie test**. `--ink-dim #6B655C` na `#F4F1EB`
daje ok. 4.6:1; gdyby wyszło mniej, przyciemnić do `#5E584F`.

- [ ] **Krok 10: commit**

```bash
git add -A && git commit -m "Fundament: tokeny, baza CSS, serwer testowy na podkatalogu, kontrasty mierzone"
```

---

## Zadanie 2: Dane — 38 szkoleń, zespół, wyjazdy

**Pliki:**
- Utworzyć: `tools/zbuduj-dane.mjs`, `data/szkolenia.json`, `data/zespol.json`,
  `data/wyjazdy.json`, `data/opinie.json`, `data/ustawienia.json`, `js/dane.js`, `tests/dane.mjs`

**Interfejsy:**
- Konsumuje: `_scrape/products.json` (38 pozycji), `_scrape/tresc/*.txt`
- Produkuje: `js/dane.js` eksportuje `pobierz(nazwa) → Promise<obiekt>` z pamięcią podręczną
  oraz stałą `GRUPY` — tablicę `{id, nazwa, kolor, zmienna, opis}`.

- [ ] **Krok 1: kształt `data/szkolenia.json`**

```json
{
  "grupy": [
    { "id": "lekarz",  "nazwa_pl": "Lekarz",           "kolor": "ogien",  "zmienna": "--ogien",
      "opis_pl": "Ty przy fotelu: motywacja pacjenta, komunikacja, przywództwo." },
    { "id": "pacjent", "nazwa_pl": "Przy pacjencie",   "kolor": "ziemia", "zmienna": "--ziemia",
      "opis_pl": "Asystentka, higienistka, opiekun pacjenta — ludzie w bezpośrednim kontakcie." },
    { "id": "kontakt", "nazwa_pl": "Pierwszy kontakt", "kolor": "slonce", "zmienna": "--slonce",
      "opis_pl": "Rejestracja i telefon: pierwsze trzydzieści sekund decyduje o wizycie." },
    { "id": "zarzad",  "nazwa_pl": "Zarządzanie",      "kolor": "chlod",  "zmienna": "--chlod",
      "opis_pl": "Właściciel i menedżer: procesy, rekrutacja, rentowność." },
    { "id": "zespol",  "nazwa_pl": "Cały zespół",      "kolor": "ink",    "zmienna": "--ink",
      "opis_pl": "Szkolenia, na których gabinet pracuje jako jeden organizm." }
  ],
  "szkolenia": [
    { "id": "mems-1", "grupa": "lekarz", "kolejnosc": 1,
      "tytul_pl": "MEMS 1 · Psychologia motywacji do leczenia, cz. 1", "tytul_en": "",
      "lead_pl": "…pierwsze zdanie opisu…",
      "opis_pl": "…pełny tekst ze starej strony…",
      "cena": 2920, "waluta": "PLN" }
  ],
  "warianty_mems": [
    { "id": "mems-calosc-1x", "nazwa_pl": "Cały projekt — płatność jednorazowa", "cena": 15330 },
    { "id": "mems-calosc-2x", "nazwa_pl": "Cały projekt — dwie raty",            "cena": 8176 },
    { "id": "mems-calosc-3x", "nazwa_pl": "Cały projekt — trzy raty",            "cena": 5791 }
  ]
}
```

- [ ] **Krok 2: `tools/zbuduj-dane.mjs` — mapowanie 9 kategorii na 5 grup**

```js
/* Przepisanie WooCommerce → nasz model. Mapa jest jawna i pełna: jeśli produkt
   trafi do kategorii spoza mapy, skrypt ma PAŚĆ, a nie po cichu go pominąć. */
const MAPA = {
  "MEMS": "lekarz",
  "Profesjonalna asystentka": "pacjent",
  "Profesjonalna higienistka": "pacjent",
  "Opiekun pacjenta": "pacjent",
  "Profesjonalna rejestratorka": "kontakt",
  "Tajemniczy pacjent": "kontakt",
  "Akademia Zarządzania": "zarzad",
  "Ekonomia gabinetu": "zarzad",
  "Szkolenia dla całej praktyki": "zespol",
};
/* Sześć pozycji bez kategorii w WooCommerce — przypisane ręcznie po treści opisu. */
const BEZ_KATEGORII = {
  "KOLOROWE JA dla zaawansowanych": "lekarz",
  "Profesjonalny model rozmowy z pacjentem ORTOdontycznym": "lekarz",
  "Efektywność działania: pewność siebie, odporność i wrażliwość wg Oboda": "lekarz",
  "Mems – cały projekt – płatność jednorazowa": "WARIANT",
  "Mems – cały projekt – płatność w dwóch ratach": "WARIANT",
  "Mems – cały projekt – płatność w trzech ratach": "WARIANT",
};
```
Skrypt oczyszcza encje HTML (`&#8211;` → `–`, `<br />` → spacja), wycina znaczniki z opisów,
wylicza `lead_pl` jako pierwsze zdanie, nadaje `id` ze slugu tytułu, sortuje MEMS po numerze.

- [ ] **Krok 3: `data/opinie.json` — teksty zastępcze, jawnie oznaczone**

Każdy wpis MUSI mieć `"do_zatwierdzenia": true`. Sześć opinii napisanych w tonie strony,
z rolą i miastem, bez wymyślonych nazwisk — inicjał + rola („dr M.K., właścicielka kliniki, Wrocław").
⚠️ Nie wymyślamy prawdziwych osób ani klinik.

- [ ] **Krok 4: `js/dane.js`**

```js
/* Jedno wejście do treści. Dziś czyta pliki JSON, jutro (faza 2) ta sama funkcja
   pójdzie do API — i żaden inny plik się nie zmieni. */
const pamiec = new Map();
export async function pobierz(nazwa) {
  if (pamiec.has(nazwa)) return pamiec.get(nazwa);
  const odp = await fetch(new URL(`../data/${nazwa}.json`, import.meta.url));
  if (!odp.ok) throw new Error(`Nie wczytano danych: ${nazwa} (${odp.status})`);
  const dane = await odp.json();
  pamiec.set(nazwa, dane);
  return dane;
}
export const jezyk = () => (location.pathname.includes("/en/") ? "en" : "pl");
/* Pole językowe z zapasem: puste EN pokazuje PL. */
export const pole = (obj, nazwa) => obj[`${nazwa}_${jezyk()}`] || obj[`${nazwa}_pl`] || "";
```

`new URL(..., import.meta.url)` zamiast `fetch("./data/...")` — inaczej ścieżka łamie się na
podstronach w podkatalogu.

- [ ] **Krok 5: `tests/dane.mjs`**

Sprawdza: 35 szkoleń + 3 warianty = 38; sumy grup 10/10/6/5/4; każde szkolenie ma niepusty
`opis_pl` **oprócz** „Ekonomia gabinetu" (oznaczone `do_zatwierdzenia`); każde ma `cena > 0`
oprócz „szkolenie szyte na miarę"; każda `grupa` istnieje w `grupy`; zero encji HTML
(`&#`, `<br`) w tytułach i opisach.

- [ ] **Krok 6: uruchomić, doprowadzić do zieleni, commit**

```bash
node tools/zbuduj-dane.mjs && node tests/dane.mjs
git add -A && git commit -m "Dane: 38 szkolen z WooCommerce przepisanych na 5 grup rolowych"
```

---

## Zadanie 3: Powłoka — nagłówek, stopka, siatka

**Pliki:**
- Utworzyć: `css/uklad.css`, `css/komponenty.css`, `js/main.js`, `tests/strony.mjs`
- Zmodyfikować: `index.html`

**Interfejsy:**
- Produkuje: klasy `.powloka`, `.pas`, `.pas--pelny`, `.naglowek`, `.stopka`, `.btn`, `.btn--gl`;
  `js/main.js` eksportuje `zamontujPowloke()`.

- [ ] **Krok 1: siatka i kontenery w `css/uklad.css`**

`.pas { max-width: var(--max); margin-inline: auto; padding-inline: var(--margines) }`,
`.pas--pelny` wychodzi na całą szerokość okna, `.siatka { display:grid; grid-template-columns: repeat(12, 1fr); gap: var(--rynna) }`,
`section { padding-block: var(--sekcja) }`. Przy `max-width: 860px` siatka spada do jednej kolumny.

- [ ] **Krok 2: nagłówek — przyklejony, z przełącznikiem języka**

Logo (`./assets/marka/logo.webp`, `width`/`height` jawne), nawigacja do 6 stron, przełącznik
`PL / EN` prowadzący do `./en/`, przycisk menu na telefonie. Nagłówek na `--paper` z dolną linią;
po przewinięciu o 80 px dostaje klasę `.naglowek--wasko` (mniejsza wysokość, `--t-stan`).

- [ ] **Krok 3: stopka** — dane firmy z `data/ustawienia.json`, trzy osoby kontaktowe,
      linki do Facebooka i Instagrama, NIP, link do polityki prywatności.

- [ ] **Krok 4: `tests/strony.mjs` — test powłoki na wszystkich stronach**

Dla każdej strony z listy: zero błędów JS, zero 404, dokładnie jeden `<h1>`,
przy 390 px `document.documentElement.scrollWidth <= innerWidth + 1`.

```js
const STRONY = ["", "mems.html", "szkolenia.html", "zespol.html", "wyjazdy.html", "kontakt.html"];
for (const s of STRONY) {
  await p.goto(baza + s, { waitUntil: "networkidle" });
  sprawdz(`${s || "index"}: jeden h1`, (await p.locator("h1").count()) === 1);
  await p.setViewportSize({ width: 390, height: 844 });
  const m = await p.evaluate(() => ({ szer: document.documentElement.scrollWidth, okno: innerWidth }));
  sprawdz(`${s || "index"}: telefon 390 px bez przewijania w bok`, m.szer <= m.okno + 1, JSON.stringify(m));
  await p.setViewportSize({ width: 1440, height: 900 });
}
```

- [ ] **Krok 5: utworzyć puste szkielety pozostałych 5 stron**, żeby test miał co sprawdzać
      (każda: powłoka + `<h1>` + jedna sekcja zastępcza).

- [ ] **Krok 6: uruchomić, zieleń, commit**

---

## Zadanie 4: Hero — kinetyczna rola na osi szerokości ⭐

To jest mechanizm, po którym poznaje się ten projekt. Zrobić go dobrze albo wcale.

**Pliki:**
- Utworzyć: `js/hero.js`, `tests/hero.mjs`
- Zmodyfikować: `index.html`, `css/uklad.css`

**Interfejsy:**
- Produkuje: `js/hero.js` eksportuje `uruchomHero(el)`; oczekuje `<span class="hero__rola" data-role>`.

- [ ] **Krok 1: znacznik w `index.html`**

Bez JS widać pierwszą rolę i pełne zdanie — to jest wersja dla wyszukiwarki i czytnika ekranu.

```html
<h1 class="hero__tytul">
  <span class="hero__slowo">Szkolimy</span>
  <span class="hero__rola" aria-live="off"
        data-role='["lekarza","rejestratorkę","higienistkę","asystentkę","menedżera","cały zespół"]'>lekarza</span>
</h1>
<p class="sr-only">Szkolimy lekarzy, rejestratorki, higienistki, asystentki, menedżerów i całe zespoły praktyk stomatologicznych.</p>
```

- [ ] **Krok 2: napisać test PRZED mechanizmem — `tests/hero.mjs`**

```js
/* Sedno: słowo-rola ma wypełniać linię co do piksela przy każdej szerokości okna.
   Mierzymy realną szerokość elementu, nie ufamy temu, że "wygląda dobrze". */
for (const szer of [390, 768, 1440, 2560]) {
  await p.setViewportSize({ width: szer, height: 900 });
  await p.waitForTimeout(900);
  const m = await p.evaluate(() => {
    const rola = document.querySelector(".hero__rola");
    const tytul = document.querySelector(".hero__tytul");
    return {
      rola: rola.getBoundingClientRect().width,
      dostepne: tytul.getBoundingClientRect().width,
      stretch: getComputedStyle(rola).fontStretch,
      tekst: rola.textContent,
    };
  });
  const wypelnienie = m.rola / m.dostepne;
  sprawdz(`hero ${szer}px: rola wypełnia linię (${(wypelnienie * 100).toFixed(1)}%)`,
    wypelnienie > 0.9 && wypelnienie <= 1.001, JSON.stringify(m));
  const st = parseFloat(m.stretch);
  sprawdz(`hero ${szer}px: oś szerokości w zakresie 62–125 (${m.stretch})`, st >= 62 && st <= 125);
}
```

- [ ] **Krok 3: uruchomić test, potwierdzić że pada** (brak `.hero__rola` albo brak dopasowania).

- [ ] **Krok 4: `js/hero.js` — pomiar i dopasowanie osi**

```js
/* Kinetyczna rola. Każde słowo ma inną długość, więc zamiast pozwolić im skakać,
   ściskamy albo rozciągamy oś szerokości fontu tak, by słowo wypełniło linię
   co do piksela. Wiersz stoi nieruchomo, litery oddychają.

   Dopasowanie idzie bisekcją, nie wzorem: szerokość tekstu nie jest liniowa
   względem osi wdth, a 12 iteracji daje dokładność poniżej pół piksela. */
const MIN = 62, MAX = 125;

function dopasuj(el, docelowa) {
  let lo = MIN, hi = MAX;
  for (let i = 0; i < 12; i++) {
    const sr = (lo + hi) / 2;
    el.style.fontStretch = sr + "%";
    if (el.getBoundingClientRect().width < docelowa) lo = sr; else hi = sr;
  }
  return (lo + hi) / 2;
}

export function uruchomHero(host) {
  const rola = host.querySelector(".hero__rola");
  const tytul = host.querySelector(".hero__tytul");
  if (!rola || !tytul) return;
  const role = JSON.parse(rola.dataset.role);
  const mniejRuchu = matchMedia("(prefers-reduced-motion: reduce)");
  let i = 0;

  const przelicz = () => {
    /* Dostępna szerokość = linia minus słowo "Szkolimy" i odstęp. */
    const linia = tytul.getBoundingClientRect().width;
    const stale = [...tytul.children].filter((c) => c !== rola)
      .reduce((s, c) => s + c.getBoundingClientRect().width, 0);
    dopasuj(rola, Math.max(120, linia - stale - 24));
  };

  const pokaz = (tekst) => {
    rola.textContent = tekst;
    rola.dataset.kolor = String(i % 4);   /* kolor roli — czytany przez CSS */
    przelicz();
  };

  pokaz(role[0]);
  new ResizeObserver(przelicz).observe(tytul);
  document.fonts.ready.then(przelicz);   /* przed dojściem fontu pomiar jest fałszywy */

  if (mniejRuchu.matches) return;        /* przy wyłączonym ruchu zostaje pierwsza rola */
  setInterval(() => { i = (i + 1) % role.length; pokaz(role[i]); }, 2600);
}
```

⚠️ `document.fonts.ready` jest obowiązkowe. Pomiar wykonany na foncie zastępczym daje
oś dopasowaną do złej metryki i słowo rozjeżdża się po dojściu Archivo.

- [ ] **Krok 5: przejście między rolami w `css/ruch.css`**

Zmiana słowa: `--t-odslona`, `font-stretch` i `opacity` przechodzą razem. Kolor roli przez
`.hero__rola[data-kolor="0"] { color: var(--ogien) }` … `="3"` → `--chlod`.
⚠️ Żółty jako kolor tekstu jest zakazany — dla `="2"` używamy `--ink` na żółtym podkreśleniu,
nie żółtego tekstu.

- [ ] **Krok 6: uruchomić test na czterech szerokościach, zieleń**

- [ ] **Krok 7: zrzut hero w 390 i 1440 px — OBEJRZEĆ, nie tylko zapisać**

⚠️ Lekcja z Perun Tac: zielony test nie mówi nic o wyglądzie.

- [ ] **Krok 8: commit**

```bash
git add -A && git commit -m "Hero: kinetyczna rola na osi szerokosci Archivo, dopasowanie bisekcja"
```

---

## Zadanie 5: Biblioteka ruchu

**Pliki:**
- Utworzyć: `js/ruch.js`, `css/ruch.css`, `tests/ruch.mjs`

**Interfejsy:**
- Produkuje: `uruchomRuch()` — rejestruje GSAP + ScrollTrigger + Lenis i uruchamia obserwatory dla
  `[data-ruch="ujawnienie"]`, `[data-ruch="maska"]`, `[data-ruch="licznik"]`, `[data-ruch="magnes"]`.

- [ ] **Krok 1: `css/ruch.css` — stany początkowe tylko przy włączonym JS**

```css
/* Stany początkowe wiszą pod .js, bo bez JavaScriptu nikt ich nie zdejmie
   i treść zostałaby niewidoczna — dla człowieka i dla wyszukiwarki. */
.js [data-ruch="maska"] > * { transform: translateY(105%); }
.js [data-ruch="ujawnienie"] .ujawnienie__kolor { clip-path: inset(100% 0 0 0); }

@media (prefers-reduced-motion: reduce) {
  /* Bez wyjątków: żadnych transformacji, żadnych clip-path, żadnego scrubowania. */
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .js [data-ruch="maska"] > *,
  .js [data-ruch="ujawnienie"] .ujawnienie__kolor { transform: none !important; clip-path: none !important; }
}
```

- [ ] **Krok 2: UJAWNIENIE — ruch‑podpis**

Portret leży dwa razy: warstwa czarno‑biała (`filter: grayscale(1) contrast(1.1)`) i nad nią
warstwa kolorowa — ten sam obraz z nałożonym kolorem grupy przez `mix-blend-mode: multiply`
na tle `var(--kolor-roli)`. Warstwa kolorowa startuje z `clip-path: inset(100% 0 0 0)`
i przy wejściu w ekran jedzie do `inset(0 0 0 0)` przez `--t-odslona`.

```js
/* UJAWNIENIE — obietnica firmy wykonana ruchem: czarno-biały człowiek
   zostaje zalany swoim kolorem. Nie jest to efekt dla efektu; to samo zdanie,
   które firma sprzedaje ("zmieniamy świadomość i zachowania"), tylko widoczne. */
function ujawnienie(el) {
  gsap.to(el.querySelector(".ujawnienie__kolor"), {
    clipPath: "inset(0% 0 0 0)",
    duration: 0.76,
    ease: "power3.inOut",           /* odpowiednik cubic-bezier(.65,0,.35,1) */
    scrollTrigger: { trigger: el, start: "top 78%", once: true },
  });
}
```

- [ ] **Krok 3: MASKA WIERSZA** — każdy wiersz w `<span class="maska"><span>…</span></span>`,
      `overflow: hidden` na zewnętrznym; wjazd `translateY(105% → 0)`, opóźnienie 60 ms na wiersz.

- [ ] **Krok 4: LICZNIK** — odliczanie od 0 do wartości z `data-do`, `--t-odslona` × 2,
      `once: true`. Format polski (spacja jako separator tysięcy: `17 000`).

- [ ] **Krok 5: MAGNES** — przycisk podąża za kursorem w promieniu 8 px.
      ⚠️ Tylko przy `matchMedia("(pointer: fine)")` — na dotyku nie ma kursora i to tylko psuje.

- [ ] **Krok 6: Lenis** — płynne przewijanie spięte ze ScrollTriggerem
      (`lenis.on("scroll", ScrollTrigger.update)`). **Wyłączone przy `prefers-reduced-motion`.**

- [ ] **Krok 7: `tests/ruch.mjs` — dwa testy, które naprawdę coś wykrywają**

```js
/* 1. Z wyłączonym ruchem nic się nie rusza i nic nie jest przycięte. */
const ctxRM = await b.newContext({ reducedMotion: "reduce" });
const pRM = await ctxRM.newPage();
await pRM.goto(baza, { waitUntil: "networkidle" });
await pRM.waitForTimeout(1200);
const ruchy = await pRM.evaluate(() => [...document.querySelectorAll("[data-ruch]")].map((e) => {
  const s = getComputedStyle(e.querySelector("*") || e);
  return { t: s.transform, c: s.clipPath };
}).filter((x) => (x.t && x.t !== "none") || (x.c && x.c !== "none")));
sprawdz("prefers-reduced-motion: zero transformacji i clip-path", ruchy.length === 0, JSON.stringify(ruchy.slice(0, 3)));

/* 2. Bez JavaScriptu strona jest kompletna — to samo, co zobaczy wyszukiwarka. */
const ctxBezJs = await b.newContext({ javaScriptEnabled: false });
const pJs = await ctxBezJs.newPage();
await pJs.goto(baza);
const widocznosc = await pJs.evaluate(() => {
  const el = [...document.querySelectorAll("h1, h2, [data-ruch] *")];
  return el.filter((e) => e.getBoundingClientRect().height > 0 && getComputedStyle(e).opacity !== "0").length;
});
sprawdz("bez JS treść jest widoczna", widocznosc > 10, String(widocznosc));
```

- [ ] **Krok 8: uruchomić, zieleń, commit**

---

## Zadanie 6: Sekcja 01 DOWÓD

**Pliki:** Zmodyfikować `index.html`, `css/komponenty.css`. Utworzyć: `js/dowod.js`.

- [ ] **Krok 1:** pięć liczb (`400` klinik, `2000` praktyk, `17 000` uczestników, `20` lat,
      `2` złote medale Krakdent 2015 i 2025) jako LICZNIK z `data-do`. Tło `--paper`, akcent `--ogien`.
- [ ] **Krok 2:** sześć opinii z `data/opinie.json`, każda z widoczną plakietką
      **`[DO ZATWIERDZENIA]`** — klient ma od razu widzieć, co jest propozycją, a co jego treścią.
- [ ] **Krok 3:** siatka 8 logotypów klinik jako zajęte ramki z podpisem
      „miejsce na logotyp — czekamy na materiały".
- [ ] **Krok 4:** test: liczniki dochodzą do wartości docelowych; separator tysięcy jest spacją;
      każda opinia zastępcza ma plakietkę. Zrzut — obejrzeć. Commit.

---

## Zadanie 7: Sekcja 02 MEMS + `mems.html`

**Pliki:** Zmodyfikować `index.html`; utworzyć `mems.html`.

- [ ] **Krok 1:** PRZEJŚCIE ROZDZIAŁU — pełnoekranowy blok `--ogien` przejmuje ekran,
      przypięty ScrollTriggerem na jedną wysokość okna, z nazwą rozdziału w `--t-display-l`.
- [ ] **Krok 2:** siedem modułów MEMS jako oś pozioma (na telefonie pionowa), każdy z numerem,
      tytułem i leadem z `data/szkolenia.json`.
- [ ] **Krok 3:** blok cenowy z `warianty_mems` — 15 330 / 8 176 / 5 791 zł, wyraźnie opisane
      jako warianty płatności za **cały cykl**, nie osobne szkolenia.
- [ ] **Krok 4:** `mems.html` — pełna opowieść: dla kogo, efekty, 7 modułów rozwiniętych, ceny,
      wersja wyjazdowa (odnośnik do Wyjazdów), CTA do kontaktu.
- [ ] **Krok 5:** test (jeden `h1`, 390 px, brak 404), zrzut, commit.

---

## Zadanie 8: Sekcja 03 TWÓJ GABINET ⭐ serce strony

**Pliki:** Zmodyfikować `index.html`, `css/komponenty.css`.

- [ ] **Krok 1:** cztery karty ról — Lekarz 🔴, Przy pacjencie 🟢, Pierwszy kontakt 🟡,
      Zarządzanie 🔵 — każda z portretem z `assets/zespol/`, nazwą roli, opisem z `grupy[].opis_pl`
      i liczbą szkoleń w grupie.
- [ ] **Krok 2:** na każdej karcie UJAWNIENIE — portret czarno‑biały zalewany kolorem roli.
      Karty ujawniają się kolejno, 120 ms odstępu.
- [ ] **Krok 3:** piąta pozycja „Cały zespół" ⚫ na pełną szerokość pod czwórką, w `--ink`,
      z czterema kolorami jako akcentami — bo to jedyne szkolenia, gdzie wszystkie role się spotykają.
- [ ] **Krok 4:** każda karta prowadzi do `./szkolenia.html?grupa=<id>`.
- [ ] **Krok 5:** test: cztery karty + jedna pełna; każda ma inny kolor; każda ma działający
      odnośnik z parametrem. Zrzut — obejrzeć. Commit.

---

## Zadanie 9: Katalog — `szkolenia.html` + `szkolenie.html`

**Pliki:** Utworzyć `szkolenia.html`, `szkolenie.html`, `js/katalog.js`, `tests/katalog.mjs`.

- [ ] **Krok 1:** render 35 kart z `data/szkolenia.json`; karta: grupa (kolor), tytuł, lead, cena.
- [ ] **Krok 2:** filtr po grupie; stan w adresie (`?grupa=lekarz`), żeby dało się podesłać link.
      Filtr działa **bez przeładowania**, ale wejście z linkiem ustawia go od razu.
- [ ] **Krok 3:** najazd na kartę — kolor grupy zalewa od lewej (`--t-stan`), cena wsuwa się z prawej.
- [ ] **Krok 4:** `szkolenie.html?id=…` — pełny opis, cena, grupa, powrót do katalogu,
      formularz „Zapytaj o termin". ⚠️ Nieznane `id` → czytelny komunikat, nie pusta strona.
- [ ] **Krok 5:** test: 35 kart bez filtra; filtry dają 10/10/6/5/4; `?grupa=lekarz` w adresie
      ustawia filtr; `szkolenie.html?id=mems-1` pokazuje tytuł; `?id=bzdura` pokazuje komunikat.
- [ ] **Krok 6:** zrzut, commit.

---

## Zadanie 10: Wyjazdy — sekcja 05 + `wyjazdy.html`

- [ ] **Krok 1:** pięć odbytych (Sri Lanka, Malta, Zanzibar, Dominikana, Indie) — kraj, daty,
      program szkoleniowy, opis ze starej strony, galeria ze sklejek w kafelkach.
      ⚠️ Sklejki **nigdy** na pełny ekran — jakość telefoniczna to widać.
- [ ] **Krok 2:** planowane (Bali, Islandia) — **sekcja „Wkrótce ogłosimy"**.
      🚨 Treści ze starej strony „Tu będziemy" są wypełniaczem po poprzednim wykonawcy
      („Jan Kowalski", „Misia Yogi", „Seans spirytystyczny") — **nie przepisywać ani ich nie parafrazować**.
- [ ] **Krok 3:** test (390 px, 404, jeden h1), zrzut, commit.

---

## Zadanie 11: Zespół — sekcja 06 + `zespol.html`

- [ ] **Krok 1:** cztery osoby z biogramami (Mariusz Oboda, dr Adrian Majewski, Marlena Majewska,
      Lidia Kaźmierczak) — pełne teksty ze starej strony, portrety, UJAWNIENIE, kolor wg roli.
- [ ] **Krok 2:** przycięcie portretów z wtopionych kolorowych kształtów przy krawędziach.
      Jeśli się nie da bez straty — zostawić i dopisać do listy próśb do klienta.
- [ ] **Krok 3:** test, zrzut, commit.

---

## Zadanie 12: Kontakt + polityka + adapter formularzy

**Pliki:** Utworzyć `kontakt.html`, `polityka-prywatnosci.html`, `js/wyslij.js`.

- [ ] **Krok 1: `js/wyslij.js` — jedyne miejsce, które zmieni faza 2**

```js
/* Adapter wysyłki. Faza 1 nie ma backendu, więc formularz waliduje, pokazuje
   potwierdzenie i loguje ładunek. Faza 2 podmienia WYŁĄCZNIE wnętrze tej funkcji
   na fetch do Workera — żaden formularz ani layout się nie zmieni. */
export async function wyslij(nazwaFormularza, dane) {
  console.info("[wyslij] " + nazwaFormularza, dane);
  await new Promise((r) => setTimeout(r, 600));   /* udawane opóźnienie sieci */
  return { ok: true, demo: true };
}
```

- [ ] **Krok 2:** formularz kontaktowy — imię, e‑mail, telefon, temat (lista grup), wiadomość,
      zgoda RODO. Walidacja po stronie przeglądarki, błędy opisane **słowem, nie samym kolorem**,
      `<label>` powiązane z polami.
- [ ] **Krok 3:** trzy osoby z zakresami spraw i telefonami (Marlena 601 370 962,
      Lidia 662 082 800, Adrian 660 619 099), dane firmy, NIP 778-104-09-65.
- [ ] **Krok 4:** ⚠️ **widoczna informacja, że w wersji demonstracyjnej formularz nie wysyła** —
      nie wolno udawać przed klientem, że działa coś, czego nie ma.
- [ ] **Krok 5:** `polityka-prywatnosci.html` — treść ze starej strony (9982 znaki), złożona
      czytelnie. ⚠️ Dopisek, że dokument wymaga aktualizacji pod nową infrastrukturę.
- [ ] **Krok 6:** test: walidacja odrzuca pusty e‑mail; komunikat błędu jest tekstem;
      wysyłka pokazuje potwierdzenie; etykiety powiązane z polami. Commit.

---

## Zadanie 13: EN, dopięcie, pełna weryfikacja, GitHub Pages

- [ ] **Krok 1:** katalog `en/` — kopie stron PL z paskiem „Translation in progress",
      przełącznik języka działa w obie strony. Pola `*_en` w danych puste → pokazuje PL.
- [ ] **Krok 2:** meta na każdej stronie: `title`, `description`, Open Graph, `lang`,
      `canonical`. Plik `sitemap.xml`, `robots.txt`.
- [ ] **Krok 3:** `README.md` — jak uruchomić lokalnie, jak wdrożyć na GitHub Pages,
      **lista braków do dostarczenia przez klienta** (§ 5 specu) jako gotowa kartka do wysłania.
- [ ] **Krok 4: pełna weryfikacja — wszystkie siedem punktów § 11 specu**

```bash
npm test                      # fundament + dane + strony + hero + ruch + katalog
node tests/zrzuty.mjs         # 1440 i 390 px, każda strona
```
⚠️ **Zrzuty trzeba obejrzeć.** Zielony pakiet nie mówi nic o tym, czy strona wygląda dobrze.

- [ ] **Krok 5:** sprawdzenie wdrożeniowe — serwis podany z `/obodagroup/`, **zero żądań 404**,
      zero ścieżek zaczynających się od `/`:

```bash
grep -rnE '(src|href)="/[^/]' --include=*.html --include=*.css --include=*.js . | grep -v node_modules
```
Oczekiwane: brak wyników.

- [ ] **Krok 6:** commit + `git push`, włączyć GitHub Pages z gałęzi.

---

## Samoprzegląd planu

**Pokrycie specu:** § 1 zakres → wszystkie zadania · § 2 firma → Z2, Z6 · § 3 diagnoza → Z4 (hero
zamiast JPG), Z8 (architektura oferty), Z10 (wypełniacz), Z3 (jeden h1), Z6 (dowód społeczny) ·
§ 4 materiał → Z2, Z8, Z10, Z11 · § 5 braki → Z6, Z10, Z13 krok 3 · § 6.1 typografia → Z1, Z4 ·
§ 6.2 paleta → Z1 (mierzone kontrasty) · § 6.3 siatka → Z3 · § 6.4 pięć grup → Z2, Z8, Z9 ·
§ 7 architektura → Z1, Z2, Z12 · § 8 katalog ruchu → Z4, Z5, Z9 · § 9 rytm → Z6–Z12 ·
§ 10 dostępność → Z1, Z3, Z5, Z12 · § 11 weryfikacja → Z13.

**Nazwy sprawdzone między zadaniami:** `pobierz()` i `pole()` (Z2) używane w Z6–Z12 ·
`uruchomHero()` (Z4) wołane w `main.js` (Z3) · `uruchomRuch()` (Z5) tamże ·
`wyslij()` (Z12) · `sprawdz()`/`wynik()`/`kontrast()`/`naRgb()` (Z1) we wszystkich testach ·
`startSerwera()` (Z1) we wszystkich testach · atrybuty `data-ruch` spójne między Z5 a Z6–Z11.

**Luka znaleziona i uzupełniona:** spec § 11 wymaga testu kontrastu dla **każdej pary
tekst/tło występującej na stronie**, a nie tylko dla tokenów — dopisane do Z13 krok 4 jako
rozszerzenie `tests/fundament.mjs` o przejście po wyrenderowanych stronach.
