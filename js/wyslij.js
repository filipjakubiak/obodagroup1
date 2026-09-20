/* ==========================================================================
   Adapter wysyłki — JEDYNE miejsce, które zmieni faza druga.

   Faza pierwsza nie ma zaplecza, więc formularz waliduje, pokazuje wynik
   i loguje ładunek. Faza druga podmienia WYŁĄCZNIE wnętrze tej funkcji na
   żądanie do serwera i żaden formularz ani układ się nie zmieni.

   Zwracamy { ok, demo }. Flaga `demo` jest po to, żeby interfejs mógł
   powiedzieć prawdę: „sprawdzone, ale nie wysłane". Udawanie wysyłki przed
   klientem byłoby najgorszym możliwym błędem w wersji demonstracyjnej.
   ========================================================================== */

export async function wyslij(nazwaFormularza, dane) {
  console.info("[wyslij] " + nazwaFormularza, dane);

  /* Udawane opóźnienie sieci: bez niego przycisk mrugałby i nie dałoby się
     zobaczyć stanu „wysyłam", który w fazie drugiej będzie realny. */
  await new Promise((r) => setTimeout(r, 600));

  return { ok: true, demo: true };
}
