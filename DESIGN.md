# Oboda Group — system wizualny

**Scena:** właściciel gabinetu, wieczór, telefon w ręku, po dwunastu godzinach
przy fotelu. Strona ma obudzić, nie ukoić. Stąd **jasny motyw i pełne pola
nasyconego koloru**, a nie ciemny „premium".

## Strategia koloru: drenched

Powierzchnia JEST kolorem. To nie jest wybór stylistyczny, tylko treść: firma uczy
**typologii osobowości**, gdzie kolor jest nazwą typu człowieka. Kolor na tej
stronie zawsze coś znaczy.

### Skąd wartości

**Odczytane z ich własnych materiałów**, nie dobrane z palety. Zmierzone udziały
w kadrze na okładkach i zdjęciach kursów:

| źródło | dominanta |
|---|---|
| okładka „Psychologia motywacji" | `#ff1800` 29%, `#ff9000` 22%, `#fff000` 7% |
| okładka „Przekonania" | `#00d800` 54%, `#7800d8` 21% |
| zdjęcia rejestratorki | `#ff7830` **63%** |
| zdjęcia Akademii Zarządzania | `#6090d8` **89%** |

Oficjalne barwy Insights Discovery okazały się na to za grzeczne. Elektryczne
nasycenie jest ich marką, nie naszym pomysłem.

### Role

| kolor | rola w gabinecie | token |
|---|---|---|
| 🔴 `#FF1800` | Lekarz, MEMS | `--ogien` |
| 🟢 `#00D800` | Przy pacjencie | `--kwas` |
| 🟡 `#FFD800` | Pierwszy kontakt | `--slonce` |
| 🔵 `#0060F0` | Zarządzanie | `--chlod` |
| 🟣 `#7800D8` | Cały zespół | `--fiolet` |

Każdy ma trzy postacie: markową (pełne pole), `-mgla` (grunt sekcji), `-tekst`
(dociemniona, przechodzi 4.5:1).

**Reguła par:** czerwień, kwas i słońce biorą tekst atramentowy; chłód i fiolet
biorą biel. Wynika z pomiaru, nie z gustu — biel na ich czerwieni daje 3.90,
atrament 4.79.

**Jedna sekcja = jeden kolor wiodący.** Egzekwowane przez klasy `.pole--*`:
sekcja deklaruje kolor jedną klasą, a grunt, akcent, kolor tekstu i tempo
wynikają z niej same.

## Typografia

- **Display: Archivo Variable** (`wdth 62–125`, `wght 400–800`). Oś szerokości jest
  mechaniką hero, nie ozdobą: słowo-rola rozciąga się tak, by wypełnić linię
  co do piksela.
- **Tekst: Geist.** Kontrast na osi geometryczny/neogrotesk, nie dwa podobne kroje.
- Display: `line-height 0.86–0.92`, `letter-spacing -0.035em` (powyżej podłogi -0.04).
- Tekst nigdy nie przekracza 68ch.

## Ruch

Jedno easing: `cubic-bezier(0.65, 0, 0.35, 1)`. Trzy czasy: 200 / 420 / 760 ms.

**Temperament:** każdy kolor ma własne tempo (440–1050 ms), bo w tej metodzie
kolor oznacza typ człowieka. Czerwony przełącza się szybko, niebieski wolno.

| ruch | gdzie |
|---|---|
| **ZAMIATANIE** | hero, płachta koloru wjeżdża `clip-path` nad stary grunt |
| **UJAWNIENIE** | zespół, karty ról — czarno-biały człowiek zalewany kolorem |
| **KINETYCZNA ROLA** | hero, oś szerokości fontu |
| **LICZNIK** | sekcja Dowód |

Zero bibliotek animacji. Wszystko na CSS i `IntersectionObserver` — dokładnie
lekcja z rozbioru `theclimatepledge.com`, który też ich nie ma.

## Kształt

Jeden system: płaszczyzny ostre (`0px`), karty `2px`, elementy interaktywne
pigułkowe (`999px`). Bez mieszania.

## Czego tu nie ma i dlaczego

- **Ciemnego motywu jako domyślnego** — scena tego nie uzasadnia. Tryb ciemny jest
  obsłużony przez `prefers-color-scheme`, ale nie jest wyborem marki.
- **Kremowego tła** — to nasycony domyślny wybór AI. Tu tło jest albo kolorem
  marki, albo ciepłą bielą `#F4F1EB` przy kolorze obok.
- **Numerowanych etykietek nad każdą sekcją** — numery są tylko w MEMS, gdzie
  siedem modułów naprawdę jest sekwencją.
