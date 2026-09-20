# OBODA GROUP — projekt strony „KOLOROWE JA"

> **Dokument sterujący nr 1.** Otwierać na starcie każdej sesji.
> Tu jest **co budujemy i dlaczego**. Plan prac (kolejność, checklisty) powstaje osobno.
>
> **Zasada:** nic nie jest „zrobione" bez `[x]` + jednej linii co dokładnie zmienione.

**Utworzony:** 2026-09-20
**Źródło treści:** `https://oboda.gtxgvaphlf.cfolks.pl/` (WordPress 7.1.1 + WooCommerce 10.7.0)
**Zrzut rozpoznania:** `_scrape/` — HTML stron, `products.json` (38 szkoleń), `assets/` (41 grafik)

---

## 1. Cel i zakres

**Faza 1 — TERAZ.** Działający, statyczny serwis na **GitHub Pages**, którego zadaniem jest
**sprzedać klientowi koncepcję**. Ma robić wrażenie wizualne przy pierwszym zetknięciu i pokazywać
całą strukturę serwisu jako rzecz gotową, nie jako makietę.

**Faza 2 — PO DECYZJI KLIENTA.** Sklep (koszyk, płatności, konta), panel treści, backend.
Nie budujemy tego teraz, ale **faza 1 nie może stanąć na drodze fazie 2** — patrz § 7.

**Poza zakresem fazy 1:** koszyk, płatności, logowanie, prawdziwa wysyłka formularzy,
tłumaczenia EN, migracja domeny, SEO techniczne poza podstawami.

### Ustalenia z klientem (Filip, 2026-09-20)
| Pytanie | Rozstrzygnięcie |
|---|---|
| Sklep | Nie teraz. Katalog ma **wyglądać** na kompletny; sklep dopiero po zakupie koncepcji. |
| Stack i hosting | Statyk, **GitHub Pages**. Bez backendu, bez procesu budowania. |
| Języki | **PL teraz, EN przygotowane** — struktura dwujęzyczna od początku, publikujemy sam PL. |
| Braki w treści | **Teksty zastępcze do akceptacji**, wyraźnie oznaczone. |

---

## 2. Co to za firma (ustalone z rozpoznania, nie z wyobraźni)

**Mariusz Oboda Consulting & Training Group**, ul. Kazimierza Wielkiego 5C/159, 61-863 Poznań,
NIP 778-104-09-65, `biuro@oboda.pl`.

Najstarsza firma szkoleniowo-doradcza dla stomatologii w Polsce. **Nie uczy stomatologii — uczy
psychologii, dentystów.** To jest zdanie, wokół którego stoi cały projekt.

Liczby ze starej strony (⚠️ do potwierdzenia przez klienta, patrz § 5):
- współpraca z **400 klinikami** w Polsce
- konsultacje i doradztwo dla ok. **2000 praktyk**
- **17 tys.** uczestników i klientów
- **dwa złote medale Krakdent** — 2015 i 2025
- **20 lat** — jako pierwsi w stomatologii wdrożyli psychologię do pracy z pacjentem

**Flagowiec: MEMS** — 7-modułowy cykl, wg materiałów firmy „nie ma odpowiednika w Polsce ani w Europie".

**Insights Discovery** — firma jest licencjonowanym użytkownikiem (test w ofercie wyjazdów, produkt
„Kolorowe Ja", moduł „Psychologia osobowości" w każdym cyklu). **Czteroko­lorowa typologia jest ich
narzędziem pracy** i to jest fundament kierunku wizualnego.
⚠️ Używamy **języka czterech kolorów**, nie logo ani koła Insights Discovery — znak towarowy
należy do Insights, nie do Obody.

---

## 3. Co jest zepsute w obecnej stronie

Diagnoza z rozpoznania — to jest lista rzeczy, które nowa strona ma naprawić:

1. **Hero to jeden plik `.webp` z wypalonym tekstem** („SZKOLIMY LUDZI / WDRAŻAMY STANDARDY /
   ROZWIJAMY PRZYWÓDZTWO"). Niewidoczne dla wyszukiwarki, nieresponsywne, zmiana hasła wymaga
   grafika. Kolaż w stylu memphis/graffiti: róż, limonka, fiolet, bryzgi farby.
2. **Rozjazd między ceną a sygnałem.** Firma bierze 2620–15330 zł od właścicieli klinik,
   a strona wygląda jak plakat festiwalu studenckiego.
3. 🚨 **Strona „Tu będziemy" jest w połowie wypełniaczem po poprzednim wykonawcy** i wisi publicznie:
   „Jan Kowalski", „Jolanta Kowalska", „Misia Yogi", „Gajowego Maruchę", „Babę z wozu",
   „Krzywego Mariana", „Sierotkę Marysię", „Seans spirytystyczny", „Stwora ze snów".
   **Nic z tego nie przechodzi do nowej strony.**
4. **Brak hierarchii nagłówków** — pięć `<h1>` na stronie głównej.
5. **Zero dowodu społecznego** mimo zaproszenia „zobacz opinie" w treści. Opinii nie ma.
6. **38 szkoleń wrzuconych na głowę** w 9 płaskich kategoriach produktowych. Odwiedzający nie ma
   ścieżki: nie wie, czy szuka czegoś dla siebie, dla rejestratorki, czy dla całego zespołu.

---

## 4. Materiał ze starej strony

**Bierzemy (41 grafik w `_scrape/assets/`):**
- `logo.webp` — znak OBODA GROUP (szary + pomarańcz `#FF7F04`)
- **wycinanki portretowe zespołu** — `about-mariusz`, `about-adrian`, `about-marlena`, `about-lidia`,
  `about-kinga`, `about-marta`, `about-ewa` + warianty `kontakt-*`. Czarno-białe, przezroczyste tło.
  ⚠️ **Portretów jest 7, ale biogramy na starej stronie ma tylko 4 osoby** (Mariusz, Adrian, Marlena,
  Lidia). Kinga, Marta i Ewa mają zdjęcia bez treści — do wyjaśnienia z klientem (pozycja w § 5).
  **To jest najlepszy materiał, jaki mamy** — na nim stoi ruch-podpis (§ 6.1).
  ⚠️ Mają wtopione kolorowe kształty geometryczne przy krawędziach — do przycięcia albo przykrycia.
- zdjęcia wyjazdów: `sri-lanka-photos`, `malta-photos`, `zanzibar-photos`, `dominikana-photos`,
  `indie-photos`, `bali-photos` — ⚠️ każdy to **sklejka 4 zdjęć w jednym pliku**, jakość telefoniczna.
  Nadają się do galerii kafelkowej, **nie** na pełny ekran.
- `logo-mems.webp`, `hero-img.webp` (jako materiał do rozbiórki, nie do użycia wprost)

**Bierzemy treść:** wszystkie opisy 38 szkoleń (600–1400 znaków każdy, prawdziwe teksty),
biogramy 4 osób, dane kontaktowe, opisy 5 odbytych wyjazdów, politykę prywatności (9982 znaki).

**Nie bierzemy:** estetyki kolażu, wypalonych tekstów w grafikach, treści „Tu będziemy".

---

## 5. Czego brakuje — do dostarczenia przez klienta

Buduję sekcje kompletne, z **tekstem zastępczym wyraźnie oznaczonym** `[DO ZATWIERDZENIA]`.
Lista dla klienta:

| Brak | Gdzie potrzebne | Co robię tymczasem |
|---|---|---|
| **Opinie uczestników** (min. 6, z imieniem, rolą, miastem) | sekcja Dowód | propozycje tekstów `[DO ZATWIERDZENIA]` na bazie tonu strony |
| **Logotypy klinik-klientów** (min. 8) | sekcja Dowód | siatka z zajętymi ramkami i podpisem, czego brakuje |
| **Prawdziwe treści Bali / Islandia** | Wyjazdy | sekcja „Wkrótce ogłosimy" — wypełniacza nie powielam |
| **Zdjęcia w wysokiej rozdzielczości** (wyjazdy, sala, zespół) | całość | obecne sklejki w kafelkach |
| **Potwierdzenie liczb** 400 / 2000 / 17 000 | Hero, Dowód | używam, oznaczone do potwierdzenia |
| **Opis „Ekonomia gabinetu"** (jedyne szkolenie bez opisu) | Szkolenia | tekst zastępczy `[DO ZATWIERDZENIA]` |
| **Zgoda na język 4 kolorów** wobec licencji Insights | całość | używamy kolorów, nie znaku |
| **Czy Kinga, Marta i Ewa nadal współpracują** — mają portrety, nie mają biogramów | Zespół | pokazuję 4 osoby z biogramami, reszta portretów czeka |

---

## 6. Kierunek wizualny

### 6.0 Myśl przewodnia
**Kolor jest metodą, nie dekoracją.** Cztery kolory typologii osobowości = cztery role w gabinecie =
cztery ścieżki szkoleniowe. Obecna strona używa koloru jak konfetti; my robimy z niego system.
Baza jest niemal monochromatyczna, żeby kolor — gdy się pojawia — **coś znaczył**.

### 6.1 Typografia

**Display: Archivo Variable** (Google Fonts, osie `wght 100–900`, `wdth 62–125`, pełna diakrytyka PL).
Oś szerokości jest **mechaniką, nie ozdobą**: w hero słowo-rola rozciąga się lub ściska tak, by co do
piksela wypełnić linię. „LEKARZA" idzie w stronę 125, „REJESTRATORKĘ" w stronę 70. Wiersz stoi
nieruchomo, litery oddychają.

**Tekst: Inter Tight** (Google Fonts) — neutralne tło dla display.

**Skala** (`clamp`, płynna):
| rola | rozmiar |
|---|---|
| display-xl (hero) | `clamp(3.5rem, 11vw, 13rem)` |
| display-l (rozdziały) | `clamp(2.5rem, 7vw, 7rem)` |
| display-m (sekcje) | `clamp(1.9rem, 4vw, 3.5rem)` |
| body-l (lead) | `clamp(1.15rem, 1.6vw, 1.5rem)` |
| body | `1.0625rem` / 1.6 |
| meta (etykiety, ceny) | `0.8125rem`, `letter-spacing: 0.08em`, wersaliki |

Display zawsze `line-height: 0.92`, `letter-spacing: -0.03em`. Tekst nigdy nie przekracza `68ch`.

### 6.2 Paleta

```
--ink        #141210   prawie czarny, ciepły     — baza 1
--paper      #F4F1EB   ciepła biel               — baza 2
--ink-dim    #6B655C   tekst drugorzędny na paper
--line       rgba(20,18,16,.14)

--ogien      #E4002B   ognisty czerwony
--slonce     #FFC72C   słoneczny żółty
--ziemia     #00A758   zielony ziemi
--chlod      #0076BF   chłodny niebieski
```

**Zasady nienaruszalne:**
1. **Żółty nigdy nie jest tekstem** — kontrast na bieli 1.8:1. Występuje wyłącznie jako pole
   z tekstem `--ink`.
2. Każda sekcja ma **jeden** kolor i trzyma go do końca. Dwa kolory w jednej sekcji = błąd.
3. Kolor nie służy do ozdabiania tła bez powodu. Kolor = rola.
4. Minimalny kontrast tekstu **4.5:1**, elementy interaktywne **3:1**. Sprawdzane pomiarem, nie okiem.

### 6.3 Siatka i przestrzeń
- Maksymalna szerokość treści **1440 px**, marginesy boczne `clamp(20px, 5vw, 80px)`.
- 12 kolumn, odstęp `24px`. Sekcje pełnoekranowe wychodzą poza siatkę do krawędzi okna.
- Rytm pionowy: sekcja = `clamp(96px, 14vh, 200px)` odstępu góra/dół.
- Telefon: jedna kolumna, marginesy 20 px, **zero poziomego przewijania** (test mierzony).

### 6.4 Architektura informacji — pięć grup zamiast dziewięciu kategorii

To jest zmiana merytoryczna, nie kosmetyczna. Stare kategorie są produktowe; nowe są **rolami
w gabinecie**, bo tak myśli osoba, która wchodzi na stronę.

| grupa | kolor | co zawiera | ile |
|---|---|---|---|
| **Lekarz** | 🔴 ogień | MEMS 1–7 + Kolorowe Ja dla zaawansowanych + ORTOdontyczny + Efektywność działania | 10 |
| **Przy pacjencie** | 🟢 ziemia | Profesjonalna asystentka (2), higienistka (4), opiekun pacjenta (4) | 10 |
| **Pierwszy kontakt** | 🟡 słońce | Profesjonalna rejestratorka (4), Tajemniczy pacjent (2) | 6 |
| **Zarządzanie** | 🔵 chłód | Akademia Zarządzania (4), Ekonomia gabinetu (1) | 5 |
| **Cały zespół** | ⚫ ink + 4 akcenty | Szkolenia dla całej praktyki (4) | 4 |

Razem 35 szkoleń. Pozostałe 3 pozycje („MEMS cały projekt" — płatność jednorazowa 15330 zł,
w dwóch ratach 8176 zł, w trzech 5791 zł) **nie są szkoleniami, tylko wariantami płatności** —
lądują jako blok cenowy na stronie MEMS, nie jako karty w katalogu.

---

## 7. Architektura techniczna

### 7.1 Zasada naczelna: faza 1 nie może zablokować fazy 2

**Treść mieszka w `data/*.json`, nie w HTML.** Strona renderuje się z danych po stronie przeglądarki.
Gdy przyjdzie backend, podmieniamy źródło danych na API i **żaden layout się nie rusza**.

```
data/szkolenia.json   38 pozycji: id, grupa, tytul, lead, opis, cena, czas, dla_kogo
data/zespol.json      4 osoby z biogramami: id, imie, rola, bio, foto, kolor, kontakt
data/wyjazdy.json     odbyte + planowane: kraj, daty, program, zdjecia, status
data/opinie.json      opinie — dziś teksty [DO ZATWIERDZENIA]
data/ustawienia.json  dane firmowe, kontakty, liczby z sekcji Dowód
```

**Formularze:** jeden adapter `js/wyslij.js` z funkcją `wyslij(nazwaFormularza, dane)`.
Dziś: walidacja + komunikat sukcesu + `console.info`. Jutro: `fetch` do Workera. **Jedno miejsce do zmiany.**

### 7.2 Pliki

```
index.html  mems.html  szkolenia.html  zespol.html  wyjazdy.html  kontakt.html
szkolenie.html          ← jedna strona szczegółu, treść z ?id= (statyk bez budowania)
polityka-prywatnosci.html
en/                     ← katalog istnieje, przełącznik w nagłówku prowadzi do ./en/.
                        Teksty w data/*.json mają pola *_pl i *_en; puste EN pokazuje PL.
css/  tokens.css  base.css  uklad.css  komponenty.css  ruch.css
js/   dane.js  hero.js  ruch.js  katalog.js  wyslij.js  main.js
assets/  marka/  zespol/  wyjazdy/
```

### 7.3 Stack
- Czysty HTML/CSS/JS, **bez frameworka i bez kroku budowania** — GitHub Pages serwuje pliki wprost.
- ⚠️ **SPROSTOWANIE po wykonaniu: GSAP i Lenis NIE zostały użyte.**
  Pierwotnie plan zakładał domowy zestaw z Perun Tac i TCC. W trakcie budowy
  okazało się, że żaden z efektów tego nie potrzebuje: zamiatanie kolorem to
  `clip-path` + `transition`, ujawnianie to `IntersectionObserver`, kinetyczna
  rola to pomiar szerokości i oś wariacyjna fontu. Dokładnie ta sama lekcja,
  którą dał rozbiór referencji (`theclimatepledge.com` nie ma żadnej biblioteki
  animacji). Dokładanie 70 kB CDN-a po to, żeby zrobić to samo, byłoby kosztem
  bez zysku — a przy statyku na GitHub Pages każdy kilobajt widać w czasie
  pierwszego renderu.
  Gdyby faza 2 wymagała przypinania sekcji albo scroll-scrubbingu, ScrollTrigger
  wchodzi wtedy, punktowo.
- **Wszystkie ścieżki względne** (`./css/...`, nie `/css/...`) — musi działać i w korzeniu domeny,
  i pod `/obodagroup/` na GitHub Pages. To jest wymóg testowany, nie wytyczna.
- Fonty z Google Fonts, `display=swap`, `preconnect`.

### 7.4 Wydajność
- Obrazy `.webp`, `loading="lazy"` poza pierwszym ekranem, jawne `width`/`height` (zero skoków układu).
- Pierwszy ekran bez blokujących zasobów poza fontem display.
- Cel: LCP < 2,5 s, CLS < 0,05 na łączu 4G.

---

## 8. Katalog ruchu

**Jedno easing na wszystko:** `cubic-bezier(0.65, 0, 0.35, 1)`.
**Trzy czasy:** `200ms` mikro (najazdy, przyciski) · `420ms` zmiana stanu · `760ms` odsłona.
Lekcja z rozpoznania referencji (`theclimatepledge.com`): tam **nie ma żadnej biblioteki animacji** —
cały „drogi" efekt stoi na czystym CSS i restrykcji. Bierzemy zasadę, nie wygląd.

| # | nazwa | co robi | gdzie |
|---|---|---|---|
| 1 | **UJAWNIENIE** ⭐ | portret czarno-biały; `clip-path` wjeżdża z dołu i **zalewa człowieka jego kolorem** | zespół, karty ról, nagłówki rozdziałów |
| 2 | **KINETYCZNA ROLA** | słowo-rola zmienia się, morfując oś `wdth` tak, by wypełnić linię | hero |
| 3 | **MASKA WIERSZA** | tekst wyjeżdża spod krawędzi, 60 ms opóźnienia między wierszami | wszystkie nagłówki |
| 4 | **KARTA SZKOLENIA** | najazd: kolor grupy zalewa kartę od lewej, cena wsuwa się od prawej | katalog |
| 5 | **PRZEJŚCIE ROZDZIAŁU** | pełnoekranowy blok koloru przejmuje ekran między sekcjami | między 02/03/04 |
| 6 | **LICZNIK** | 400 · 2000 · 17 000 · 20 · 2 odliczają przy wejściu w ekran | sekcja Dowód |
| 7 | **MAGNES** | przycisk lekko podąża za kursorem w promieniu 8 px | CTA (tylko wskaźnik precyzyjny) |

**`prefers-reduced-motion: reduce` — wszystko spada do samej przezroczystości albo do zera.**
Bez wyjątków, bez „ale ten jest delikatny". Sprawdzane testem.

⚠️ **Ruch nigdy nie ukrywa treści przed wyszukiwarką ani przed czytnikiem ekranu.** Elementy są
w DOM widoczne domyślnie; klasę ukrywającą dokłada JS dopiero po starcie. Przy wyłączonym JS strona
jest kompletna i czytelna.

---

## 9. Strona główna — rytm

```
00  HERO           ink. Kinetyczna rola. Podtytuł. Dwa CTA. Pasek liczb u dołu.
01  DOWÓD          paper. 400 · 2000 · 17 000 · 20 lat · 2 medale. Opinie. Logotypy klinik.
02  MEMS           przejście rozdziału → ogień. 7 modułów jako oś. Blok cenowy (3 warianty).
03  TWÓJ GABINET   ⭐ serce strony. Cztery role, cztery kolory, UJAWNIENIE na portretach.
                   Stąd — i tylko stąd — prowadzi droga do katalogu.
04  SZKOLENIA      paper. 38 pozycji, filtr po roli (kolorze), nie po kategorii produktowej.
05  WYJAZDY        ink. Sri Lanka → Malta → Zanzibar → Dominikana → Indie. Planowane: „wkrótce".
06  ZESPÓŁ         paper. Wycinanki, UJAWNIENIE, biogramy.
07  KONTAKT        ink. Formularz + trzy osoby z telefonami + dane firmy.
```

**Sekcja 03 jest sercem projektu.** Pokazuje praktykę jako zespół ludzi, z których każdego można
rozwinąć — i dopiero stąd prowadzi do szkoleń. Obecna strona wysypuje 38 produktów i zostawia
odwiedzającego samego.

### Pozostałe strony
- **mems.html** — pełna opowieść o flagowcu: 7 modułów, dla kogo, efekty, ceny, wyjazdowa wersja.
- **szkolenia.html** — katalog z filtrem ról; karta → `szkolenie.html?id=`.
- **zespol.html** — 4 biogramy (Mariusz, Adrian, Marlena, Lidia) z pełnymi tekstami ze starej strony.
- **wyjazdy.html** — 5 odbytych z galeriami, planowane jako „wkrótce ogłosimy".
- **kontakt.html** — formularz, trzy osoby z zakresami spraw, dane firmy, mapa.

---

## 10. Dostępność
- Kontrast tekstu **≥ 4.5:1**, elementów interaktywnych **≥ 3:1** — mierzone, nie oceniane wzrokiem.
- Pełna obsługa klawiaturą, widoczny `:focus-visible` na każdym elemencie interaktywnym.
- Jeden `<h1>` na stronę, hierarchia nagłówków bez przeskoków.
- Każdy obraz niosący treść ma `alt`; dekoracyjne mają `alt=""`.
- Formularze: `<label>` powiązane z polami, błędy opisane słowem, nie samym kolorem.
- `prefers-reduced-motion` obsłużone w całości.

## 11. Weryfikacja — co musi przejść, zanim powiem „gotowe"

Testy przeglądarkowe (Playwright), na wzór `tests/` z Perun Tac:
1. **Ścieżki względne** — strona działa serwowana z podkatalogu `/obodagroup/`; zero żądań 404.
2. **Telefon 390 px** — zero poziomego przewijania na każdej stronie, mierzone `getBoundingClientRect`.
3. **Kontrast** — wyliczony dla każdej pary tekst/tło występującej na stronie.
4. **Bez JS** — każda strona czytelna i kompletna przy wyłączonym JavaScripcie.
5. **`prefers-reduced-motion`** — przy włączonej preferencji nie ma żadnej transformacji.
6. **Zero błędów JS** w konsoli na każdej stronie.
7. **Zrzuty** wszystkich stron w 1440 i 390 px — **obejrzane przeze mnie**, nie tylko zapisane.

⚠️ Lekcja z Perun Tac: **zielony test nie mówi nic o wyglądzie.** Po każdej zmianie w UI — zrzut
albo pomiar, nie sam `npm test`.

## 12. Ryzyka

| ryzyko | reakcja |
|---|---|
| **Dyscyplina koloru pęka** i wracamy do chaosu | zasady § 6.2 są testowane: jedna sekcja = jeden kolor |
| Oś `wdth` w hero liczona źle przy skrajnych szerokościach okna | zakres ograniczony do 62–125, poza nim zwykłe zawijanie; test na 390/768/1440/2560 |
| Wycinanki zespołu mają wtopione kolorowe kształty | przycięcie albo przykrycie; jeśli się nie da — prosimy klienta o oryginały |
| Klient zakwestionuje język 4 kolorów wobec licencji Insights | używamy kolorów, nie znaku; pytanie na liście § 5 |
| Sklejki zdjęć z wyjazdów są za słabe | trzymamy je w kafelkach, nigdy na pełny ekran; prośba o oryginały |
| Faza 2 wymusza przebudowę | treść w `data/*.json` od pierwszego dnia, formularze przez jeden adapter |
