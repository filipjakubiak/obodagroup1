/* Serwer testowy. Montuje katalog projektu pod /obodagroup/ — dokładnie tak,
   jak zrobi to GitHub Pages dla repozytorium projektowego. Dzięki temu każda
   ścieżka bezwzględna wywala się tutaj, a nie dopiero po wdrożeniu. */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const KORZEN = path.resolve(import.meta.dirname, "..");
const BAZA = "/obodagroup";
const TYPY = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".webp": "image/webp",
  ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
};

export function startSerwera(port = 4310) {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (!p.startsWith(BAZA)) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("poza bazą " + BAZA + " — to znaczy, że gdzieś jest ścieżka bezwzględna");
      return;
    }
    p = p.slice(BAZA.length) || "/";
    if (p.endsWith("/")) p += "index.html";
    const plik = path.join(KORZEN, p);
    if (!plik.startsWith(KORZEN) || !fs.existsSync(plik) || fs.statSync(plik).isDirectory()) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("404 " + p);
      return;
    }
    res.writeHead(200, { "content-type": TYPY[path.extname(plik)] || "application/octet-stream" });
    fs.createReadStream(plik).pipe(res);
  });
  return new Promise((ok) => srv.listen(port, () => ok({
    url: `http://127.0.0.1:${port}${BAZA}/`,
    stop: () => srv.close(),
  })));
}

if (process.argv[1] && import.meta.filename === path.resolve(process.argv[1])) {
  startSerwera().then((s) => console.log("serwer:", s.url));
}
