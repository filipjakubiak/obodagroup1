/* Katalog: liczby, filtr, stan w adresie, strona szczegółu. */
import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import { sprawdz, wynik } from "./pomocniki.mjs";

const s = await startSerwera(4316);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bledy = [];
p.on("pageerror", (e) => bledy.push(String(e)));
p.on("console", (m) => { if (m.type() === "error") bledy.push(m.text()); });
p.on("response", (r) => { if (r.status() >= 400) bledy.push(r.status() + " " + r.url()); });

console.log("== katalog ==");
await p.goto(s.url + "szkolenia.html", { waitUntil: "networkidle" });
await p.waitForSelector(".karta");
await p.waitForTimeout(600);
sprawdz("bez filtra widac 35 szkolen", (await p.locator(".karta").count()) === 35,
  String(await p.locator(".karta").count()));
sprawdz("filtr ma szesc przyciskow (wszystkie + piec grup)",
  (await p.locator(".filtr__btn").count()) === 6, String(await p.locator(".filtr__btn").count()));

/* Sumy grup sa kontraktem z danymi: 10/10/6/5/4 = 35. Gdyby ktos przeniosl
   szkolenie miedzy grupami, ten test ma o tym powiedziec. */
const OCZEK = { lekarz: 10, pacjent: 10, kontakt: 6, zarzad: 5, zespol: 4 };
for (const [id, ile] of Object.entries(OCZEK)) {
  await p.click('.filtr__btn[data-grupa="' + id + '"]');
  await p.waitForTimeout(220);
  const n = await p.locator(".karta").count();
  sprawdz(`filtr "${id}" pokazuje ${ile}`, n === ile, String(n));
  sprawdz(`filtr "${id}" trafia do adresu`,
    new URL(p.url()).searchParams.get("grupa") === id, p.url());
}

console.log("\n== wejscie z linkiem ==");
await p.goto(s.url + "szkolenia.html?grupa=zarzad", { waitUntil: "networkidle" });
await p.waitForSelector(".karta");
sprawdz("link ustawia filtr od razu", (await p.locator(".karta").count()) === 5,
  String(await p.locator(".karta").count()));
sprawdz("wybrany przycisk oznaczony dla czytnika ekranu",
  (await p.getAttribute('.filtr__btn[data-grupa="zarzad"]', "aria-pressed")) === "true");

await p.goto(s.url + "szkolenia.html?grupa=bzdura", { waitUntil: "networkidle" });
await p.waitForSelector(".karta");
sprawdz("nieznany filtr w adresie nie daje pustej strony",
  (await p.locator(".karta").count()) === 35, String(await p.locator(".karta").count()));

console.log("\n== strona szczegolu ==");
await p.goto(s.url + "szkolenie.html?id=inteligencja-komunikacji", { waitUntil: "networkidle" });
await p.waitForSelector(".szkol__tytul");
sprawdz("szczegol pokazuje tytul",
  (await p.textContent(".szkol__tytul")).includes("Inteligencja komunikacji"),
  await p.textContent(".szkol__tytul"));
sprawdz("szczegol ma liste korzysci", (await p.locator(".szkol__korzysc").count()) >= 5,
  String(await p.locator(".szkol__korzysc").count()));
sprawdz("szczegol ma cene", (await p.textContent(".szkol__kwota")).includes("2620"),
  await p.textContent(".szkol__kwota"));
sprawdz("tytul dokumentu niesie nazwe szkolenia", (await p.title()).includes("Inteligencja"), await p.title());

await p.goto(s.url + "szkolenie.html?id=nie-ma-takiego", { waitUntil: "networkidle" });
await p.waitForSelector(".szkol__tytul");
sprawdz("nieznane id daje czytelny komunikat, nie pusta strone",
  (await p.textContent(".szkol__tytul")).includes("Nie znaleźliśmy"),
  await p.textContent(".szkol__tytul"));

console.log("\n== telefon ==");
await p.setViewportSize({ width: 390, height: 844 });
for (const adres of ["szkolenia.html", "szkolenie.html?id=lider"]) {
  await p.goto(s.url + adres, { waitUntil: "networkidle" });
  await p.waitForTimeout(500);
  const m = await p.evaluate(() => ({ szer: document.documentElement.scrollWidth, okno: innerWidth }));
  sprawdz(`${adres} na 390 px bez przewijania w bok`, m.szer <= m.okno + 1, JSON.stringify(m));
}

sprawdz("zero bledow JS i 404", bledy.length === 0, bledy.slice(0, 4).join(" | "));
await b.close();
s.stop();
wynik();
