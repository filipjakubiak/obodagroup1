/* Wyciąg czytelnego tekstu + nagłówków + obrazków ze zrzutu HTML. */
import fs from "node:fs";
const plik = process.argv[2];
let h = fs.readFileSync(plik, "utf8");
h = h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
     .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
const dek = (t) => t.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#8217;|&rsquo;/g, "'").replace(/&hellip;/g, "…");
console.log("=== NAGŁÓWKI ===");
[...h.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)].forEach((m) => {
  const t = dek(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  if (t) console.log(" " + m[1].toUpperCase() + "  " + t);
});
console.log("\n=== TEKST ===");
const body = (h.match(/<body[\s\S]*<\/body>/i) || [h])[0];
const txt = dek(body.replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/section)>/gi, "\n").replace(/<[^>]+>/g, " "))
  .split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 2);
const widziane = new Set();
txt.forEach((l) => { if (!widziane.has(l)) { widziane.add(l); console.log(" " + l); } });
