# Prší Skóre — veřejná verze (bez přihlášení)

Jednoduchá appka na počítání skóre u prší. Běží jako normální web — kdokoli s odkazem
ji může otevřít a hrát, bez účtu a bez přihlašování. Historie a aktuální hra se
ukládají na serveru (Upstash Redis), takže je vidí všichni stejně.

## Co je uvnitř

- `public/index.html` — celá appka (frontend), jeden soubor
- `api/state.js` — aktuální rozehraná hra (GET / PUT / DELETE)
- `api/history.js` — seznam odehraných session (GET / POST)
- `api/history/[id].js` — smazání jedné session (DELETE)
- `lib/redis.js` — připojení na úložiště

## Nasazení na Vercel (jednorázově)

1. **Nahraj tuhle složku na GitHub** (nový repo, stačí veřejný nebo soukromý).
2. Na [vercel.com](https://vercel.com) klikni **Add New → Project** a vyber ten repo.
   Framework Preset nech na "Other" / "No framework" — žádné nastavení není potřeba,
   Vercel pozná `api/` a `public/` sám.
3. Klikni **Deploy**. Appka se nasadí, ale zatím bez databáze nebude ukládat data
   (zobrazí se "offline, zkouším znovu…").
4. V projektu na Vercelu jdi do **Storage → Create Database → Redis** (přes Upstash,
   je to zdarma v malém rozsahu) a připoj ho k tomuhle projektu. Vercel sám přidá
   potřebné proměnné prostředí.
5. Jdi do **Deployments** a udělej **Redeploy** (aby appka proměnné načetla).

Hotovo — odkaz na appku (něco jako `https://prsi-skore.vercel.app`) teď můžeš poslat
komukoli, nikdo se nikam nepřihlašuje a všichni vidí stejná data.

## Jedna poznámka k bezpečnosti

Appka nemá žádné přihlašování ani heslo — kdokoli s odkazem může i zapisovat
(přičítat body, mazat zápisy). To je záměr (ať se kluci nemusí nikam hlásit), ale
znamená to, že odkaz je dobré nesdílet veřejně mimo partu, se kterou hraješ.
