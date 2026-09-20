/* Wszystkie strony: powłoka, hierarchia, telefon, formularz, brak JS. */
import { chromium } from "playwright";
import { startSerwera } from "../tools/serwer.mjs";
import { sprawdz, wynik } from "./pomocniki.mjs";

const STRONY = [
  "", "mems.html", "szkolenia.html", "zespol.html",
  "wyjazdy.html", "kontakt.html", "polityka-prywatnosci.html",
  "szkolenie.html?id=lider",
];

const s = await startSerwera(4318);
const b = await chromium.launch();

console.log("== kazda strona ==");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const bledy = [];
  p.on("pageerror", (e) => bledy.push(String(e)));
  p.on("console", (m) => { if (m.type() === "error") bledy.push(m.text()); });
  p.on("response", (r) => { if (r.status() >= 400) bledy.push(r.status() + " " + r.url()); });

  for (const adres of STRONY) {
    const nazwa = adres || "index";
    bledy.length = 0;
    await p.goto(s.url + adres, { waitUntil: "networkidle" });
    await p.waitForTimeout(900);

    sprawdz(`${nazwa}: dokladnie jeden h1`, (await p.locator("h1").count()) === 1,
      String(await p.locator("h1").count()));
    sprawdz(`${nazwa}: ma tytul i opis`,
      (await p.title()).length > 8 && !!(await p.getAttribute('meta[name="description"]', "content")));
    sprawdz(`${nazwa}: nawigacja i stopka na miejscu`,
      (await p.locator(".naglowek__link").count()) >= 5 && (await p.locator(".stopka").count()) === 1);
    sprawdz(`${nazwa}: zero bledow JS i 404`, bledy.length === 0, bledy.slice(0, 3).join(" | "));

    await p.setViewportSize({ width: 390, height: 844 });
    await p.waitForTimeout(400);
    const m = await p.evaluate(() => ({ szer: document.documentElement.scrollWidth, okno: innerWidth }));
    sprawdz(`${nazwa}: telefon 390 px bez przewijania w bok`, m.szer <= m.okno + 1, JSON.stringify(m));
    await p.setViewportSize({ width: 1440, height: 900 });
  }
  await p.close();
}

console.log("\n== tresc podstron ==");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });

  await p.goto(s.url + "zespol.html", { waitUntil: "networkidle" });
  await p.waitForSelector(".osoba");
  sprawdz("zespol: cztery osoby z biogramami", (await p.locator(".osoba").count()) === 4,
    String(await p.locator(".osoba").count()));
  sprawdz("zespol: kazdy portret ma opis alternatywny",
    (await p.locator(".osoba__foto[alt='']").count()) === 0);

  await p.goto(s.url + "wyjazdy.html", { waitUntil: "networkidle" });
  await p.waitForSelector(".wyjazd");
  sprawdz("wyjazdy: piec odbytych", (await p.locator(".wyjazd").count()) === 5,
    String(await p.locator(".wyjazd").count()));
  const tresc = await p.textContent("body");
  /* Wypelniacz po poprzednim wykonawcy NIE moze przejsc do nowej strony. */
  for (const slowo of ["Jan Kowalski", "Misia Yogi", "Sierotkę Marysię", "Seans spirytystyczny", "Stwora ze snów", "Krzywego Mariana"]) {
    sprawdz(`wyjazdy: wypelniacz "${slowo}" nie przeszedl`, !tresc.includes(slowo));
  }
  sprawdz("wyjazdy: zapowiedz zamiast zmyslonych terminow", tresc.includes("Kolejny wyjazd ogłosimy"));

  await p.goto(s.url + "mems.html", { waitUntil: "networkidle" });
  await p.waitForSelector(".mems__poz");
  sprawdz("mems: siedem modulow", (await p.locator(".mems__poz").count()) === 7,
    String(await p.locator(".mems__poz").count()));
  sprawdz("mems: trzy warianty platnosci", (await p.locator(".ceny__poz").count()) === 3);

  await p.close();
}

console.log("\n== formularz kontaktowy ==");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(s.url + "kontakt.html", { waitUntil: "networkidle" });
  await p.waitForSelector(".form");

  sprawdz("kontakt: trzy osoby z telefonami", (await p.locator(".czlowiek").count()) === 3);
  sprawdz("kontakt: kazde pole ma powiazana etykiete", await p.evaluate(() => {
    const pola = [...document.querySelectorAll(".form__pole, #f-zgoda")];
    return pola.every((x) => !!document.querySelector(`label[for="${x.id}"]`) || !!x.closest("label"));
  }));
  sprawdz("kontakt: widoczna informacja, ze wersja demonstracyjna nie wysyla",
    (await p.textContent(".form__demo")).includes("nie wysyła"));

  /* Pusty formularz: bledy maja byc opisane SLOWEM, nie samym kolorem. */
  await p.click('.form button[type="submit"]');
  await p.waitForTimeout(300);
  const bledyTekst = await p.evaluate(() =>
    [...document.querySelectorAll(".form__blad")].map((b) => b.textContent.trim()).filter(Boolean));
  sprawdz("kontakt: pusty formularz daje bledy opisane slowem", bledyTekst.length >= 3,
    JSON.stringify(bledyTekst));
  sprawdz("kontakt: pierwsze bledne pole dostaje fokus",
    (await p.evaluate(() => document.activeElement.id)) === "f-imie",
    await p.evaluate(() => document.activeElement.id));
  sprawdz("kontakt: bledne pole oznaczone dla czytnika ekranu",
    (await p.getAttribute("#f-imie", "aria-invalid")) === "true");

  await p.fill("#f-imie", "Anna Testowa");
  await p.fill("#f-email", "anna@przyklad.pl");
  await p.fill("#f-wiadomosc", "Proszę o informację o najbliższym terminie szkolenia dla rejestratorek.");
  await p.check("#f-zgoda");
  await p.click('.form button[type="submit"]');
  await p.waitForTimeout(1100);
  sprawdz("kontakt: poprawny formularz mowi prawde o braku wysylki",
    (await p.textContent(".form__stan")).includes("nie została wysłana"),
    await p.textContent(".form__stan"));

  await p.goto(s.url + "kontakt.html?szkolenie=lider", { waitUntil: "networkidle" });
  await p.waitForSelector(".form");
  sprawdz("kontakt: wejscie z karty szkolenia podpowiada tresc",
    (await p.inputValue("#f-wiadomosc")).includes("Lider"), await p.inputValue("#f-wiadomosc"));
  await p.close();
}

console.log("\n== bez JavaScriptu ==");
{
  const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  for (const adres of ["", "szkolenia.html", "zespol.html", "kontakt.html"]) {
    await p.goto(s.url + adres, { waitUntil: "domcontentloaded" });
    const widoczne = await p.evaluate(() =>
      [...document.querySelectorAll("h1, h2, .naglowek__link, .stopka p")]
        .filter((e) => e.getBoundingClientRect().height > 0 && getComputedStyle(e).opacity !== "0").length);
    sprawdz(`${adres || "index"}: bez JS nawigacja i tresc sa widoczne`, widoczne >= 8, String(widoczne));
  }
  await ctx.close();
}

await b.close();
s.stop();
wynik();
