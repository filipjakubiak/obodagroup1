# Oboda Group — nowy serwis

Statyczny serwis dla **Mariusz Oboda Consulting & Training Group**.
Faza 1: wizualny dowód koncepcji do pokazania klientowi. Bez zaplecza, bez sklepu.

Dokumenty sterujące:
- `docs/superpowers/specs/2026-09-20-obodagroup-redesign-design.md` — co i dlaczego
- `docs/superpowers/plans/2026-09-20-obodagroup-faza1.md` — plan prac

---

## Uruchomienie

```bash
npm install
npm run dev     # http://127.0.0.1:4310/obodagroup/
npm test        # pięć pakietów, ok. 170 sprawdzeń
npm run build   # przebudowa data/*.json i stron z generatora
```

⚠️ **Serwer testowy podaje stronę pod `/obodagroup/`, nie w korzeniu.** To celowe:
dokładnie tak zachowa się GitHub Pages dla repozytorium projektowego, więc każda
ścieżka bezwzględna wywala się u nas, a nie po wdrożeniu.

## Struktura

```
index.html  mems.html  szkolenia.html  szkolenie.html
zespol.html  wyjazdy.html  kontakt.html  polityka-prywatnosci.html  en/

css/    tokens.css   wyłącznie zmienne: kolory, skala, czasy
        base.css     reset i typografia
        uklad.css    siatka, powłoka, hero
        komponenty.css

js/     dane.js      jedno wejście do treści (faza 2 podmieni źródło na API)
        hero.js      kinetyczna rola na osi szerokości fontu
        ruch.js      wspólne ujawnianie + zabezpieczenie
        gabinet.js  dowod.js  mems.js  katalog.js  strony.js
        wyslij.js    adapter formularzy, JEDYNE miejsce dla fazy 2

data/   szkolenia.json  zespol.json  wyjazdy.json  opinie.json  ustawienia.json
tools/  serwer.mjs  zbuduj-dane.mjs  zbuduj-strony.mjs
tests/  fundament  kontrast  katalog  strony  wdrozenie
```

**Treść nie siedzi w HTML-u, tylko w `data/*.json`.** Dzięki temu faza 2 podmieni
źródło danych na API i żaden układ się nie ruszy.

**Strony generuje `tools/zbuduj-strony.mjs`.** Nagłówek i stopka idą statycznie do
każdego pliku, bo nawigacja musi działać przy wyłączonym JavaScripcie — ale źródło
jest jedno. **Nie edytować `.html` ręcznie**, tylko generator i uruchomić `npm run build`.

## Wdrożenie na GitHub Pages

1. `git push` na gałąź `main`
2. Settings → Pages → Source: `main`, katalog `/`
3. Plik `.nojekyll` jest w repozytorium (bez niego Pages pomija katalogi z `_`)
4. Po zmianie adresu docelowego: poprawić stałą `ADRES` w `tools/zbuduj-strony.mjs`
   i przebudować (`npm run build`)

---

# ⛔ Czego potrzebujemy od klienta

Wszystkie miejsca poniżej są **zbudowane i widoczne na stronie**, oznaczone plakietką
„do potwierdzenia" albo „propozycja do zatwierdzenia". Nic nie zostało zmyślone.

| # | Co | Gdzie na stronie | Stan teraz |
|---|---|---|---|
| 1 | **Opinie uczestników** — min. 6, z rolą i miastem, najlepiej z imieniem za zgodą | Strona główna, sekcja Dowód | 6 propozycji tekstu z plakietką „propozycja do zatwierdzenia" |
| 2 | **Logotypy klinik** — min. 8 plików + zgody na publikację | Strona główna, sekcja Dowód | 8 pustych ramek z podpisem |
| 3 | **Potwierdzenie liczb**: 400 klinik, 2000 praktyk, 17 000 uczestników | Hero i Dowód | używane, z plakietką „do potwierdzenia" |
| 4 | **Opis szkolenia „Ekonomia gabinetu"** — jedyne bez opisu w starym sklepie | Katalog i strona szczegółu | plakietka „opis do uzupełnienia" |
| 5 | **Prawdziwe terminy wyjazdów** (Bali, Islandia albo inne) | Wyjazdy | zapowiedź „ogłosimy wkrótce" |
| 6 | **Opis wyjazdu do Indii** | Wyjazdy | plakietka „opis do uzupełnienia" |
| 7 | **Zdjęcia w wyższej rozdzielczości** — wyjazdy to sklejki czterech kadrów z telefonu | Wyjazdy | pokazane w kafelku, nigdy na pełny ekran |
| 8 | **Portrety zespołu bez wtopionego tła** — obecne mają wklejone kolorowe bryły | Zespół, strona główna | kadrowane tak, żeby bryły wyszły poza ekran |
| 9 | **Czy Kinga, Marta i Ewa nadal współpracują** — mają portrety, nie mają biogramów | Zespół | pokazane 4 osoby z biogramami |
| 10 | **Aktualizacja polityki prywatności przez prawnika** — opisuje starą infrastrukturę | Polityka | przeniesiona z jawną adnotacją |
| 11 | **Zgoda na język czterech kolorów** wobec licencji Insights Discovery | całość | używamy kolorów, nie znaku towarowego |
| 12 | **Tłumaczenia EN** — 35 opisów, biogramy, wyjazdy | `/en/` | jedna strona-zapowiedź |

## 🚨 Znalezione na obecnej stronie, wymaga reakcji niezależnie od re-designu

Strona **„Tu będziemy" jest w połowie wypełniaczem** po poprzednim wykonawcy i wisi
publicznie: „Jan Kowalski", „Jolanta Kowalska", „Misia Yogi", „Gajowego Maruchę",
„Babę z wozu", „Krzywego Mariana", „Sierotkę Marysię", „Seans spirytystyczny",
„Stwora ze snów". **Nic z tego nie przeszło do nowego serwisu** i test tego pilnuje,
ale na starej stronie to nadal widać.

---

## Zasady, których pilnują testy

- **Ścieżki wyłącznie względne** — serwis musi działać w korzeniu i w podkatalogu
- **Kontrast ≥ 4.5:1** dla tekstu, mierzony na wyrenderowanej stronie w obu trybach,
  z uwzględnieniem łańcucha przezroczystości
- **Zero myślników i półpauz** w treści widocznej dla użytkownika
- **Jedna sekcja = jeden kolor wiodący**, egzekwowane przez klasy `.pole--*`
- **Bez JavaScriptu strona jest kompletna** — nawigacja, treść i stopka widoczne
- **`prefers-reduced-motion`** wyłącza każdą transformację
- **Telefon 390 px bez poziomego przewijania** na każdej stronie
- **Jeden `<h1>` na stronę**
