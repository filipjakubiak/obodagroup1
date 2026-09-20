/* Jedno wejście do treści.
   Dziś czyta pliki JSON z katalogu data/. W fazie drugiej ta sama funkcja
   pójdzie do API i ŻADEN inny plik się nie zmieni — o to chodzi w tym,
   że treść nie siedzi w HTML-u. */

const pamiec = new Map();

export async function pobierz(nazwa) {
  if (pamiec.has(nazwa)) return pamiec.get(nazwa);
  /* new URL wobec import.meta.url, a nie "./data/..." — inaczej ścieżka
     łamie się na podstronach i pod podkatalogiem GitHub Pages. */
  const odp = await fetch(new URL(`../data/${nazwa}.json`, import.meta.url));
  if (!odp.ok) throw new Error(`Nie wczytano danych: ${nazwa} (${odp.status})`);
  const dane = await odp.json();
  pamiec.set(nazwa, dane);
  return dane;
}

export const jezyk = () => (location.pathname.includes("/en/") ? "en" : "pl");

/* Pole językowe z zapasem: puste EN pokazuje PL. Dzięki temu można publikować
   wersję angielską częściami, bez dziur na stronie. */
export const pole = (obj, nazwa) => obj[`${nazwa}_${jezyk()}`] || obj[`${nazwa}_pl`] || "";

export const zlotowki = (n) =>
  new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(n) + " zł";
