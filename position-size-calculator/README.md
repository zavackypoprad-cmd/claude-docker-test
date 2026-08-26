# Position Size Calculator

Appka, ktorá vypočíta veľkosť pozície (počet lotov / jednotiek), aby si pri
danom stop lossu zariskoval presne stanovené percento (alebo pevnú sumu)
svojho obchodného účtu.

Vzorec:

```
Riziko na obchod = Zostatok účtu × Riziko (%)          (alebo pevná suma)
Vzdialenosť SL    = |Vstupná cena − Cena stop lossu|     (alebo pipy × veľkosť pipu)
Veľkosť pozície   = Riziko na obchod / (Vzdialenosť SL × konverzný kurz)
Počet lotov       = Veľkosť pozície / veľkosť kontraktu
```

Konverzný kurz sa použije len vtedy, keď je kótovaná mena inštrumentu iná
ako mena tvojho účtu (napr. EUR/JPY na EUR účte) — inak necháš hodnotu `1`.

## Prečo PWA (a nie Flutter/natívna appka)

Ide o **Progressive Web App** — jeden kód v HTML/CSS/JS bez akéhokoľvek
build kroku:

- **Android**: otvor appku v Chrome → menu → "Pridať na plochu" / "Nainštalovať appku".
  Vznikne ikona ako pri natívnej appke, appka beží na celú obrazovku a funguje
  aj offline (service worker).
- **PC (Windows/macOS/Linux)**: otvor appku v Chrome alebo Edge → v adresnom
  riadku klikni na ikonu "Nainštalovať" (alebo menu → "Nainštalovať appku").
  Appka sa spustí ako samostatné okno s vlastnou ikonou, mimo prehliadača.

Dôvod tejto voľby: natívna Flutter appka pre Android/PC by vyžadovala
Flutter SDK, Android SDK/Gradle a code-signing, čo presahuje rámec
jednoduchého, rýchlo prenosného nástroja a nedalo by sa to v tomto prostredí
ani zostaviť/otestovať. PWA je plne funkčná appka na oboch platformách,
zadarmo, bez app store schvaľovania a s jedným zdrojovým kódom.

Ak by si neskôr chcel skutočný natívny Android balík (.apk/.aab), dá sa táto
PWA jednoducho zabaliť nástrojom [Capacitor](https://capacitorjs.com/) —
bez prepisovania logiky (`calc.js`, `presets.js`, `app.js` ostanú rovnaké).

## Spustenie lokálne

Nepotrebuješ žiadny build ani inštaláciu závislostí, appka je čisté
statické HTML/CSS/JS. Stačí ju servovať cez ľubovoľný statický server
(kvôli `fetch` v service workeri to nefunguje priamo z `file://`):

```bash
cd position-size-calculator
npx http-server -p 8080 -c-1 .
# alebo: python3 -m http.server 8080
```

Potom otvor `http://localhost:8080`.

## Testy výpočtovej logiky

```bash
cd position-size-calculator
node calc.test.js
```

## Štruktúra

```
position-size-calculator/
├── index.html          # UI
├── styles.css           # svetlá/tmavá téma, responzívny layout
├── calc.js               # čistá výpočtová logika (testovateľná samostatne)
├── calc.test.js          # unit testy pre calc.js
├── presets.js            # predvoľby inštrumentov (pip size, veľkosť kontraktu)
├── app.js                 # prepojenie UI ↔ calc.js, localStorage, téma
├── manifest.webmanifest  # PWA manifest (názov appky, ikony, farby)
├── service-worker.js     # offline cache
└── icons/                # ikony appky (192/512 px + maskable)
```

## Poznámky k presnosti

- Konverzný kurz (pri krížových menách) a veľkosť kontraktu si vždy over
  podľa špecifikácie svojho brokera — líšia sa broker od brokera.
- Appka nevolá žiadne externé API (žiadne live kurzy) — funguje úplne
  offline a bez závislosti na internete.
- Appka len počíta veľkosť pozície, neposkytuje investičné odporúčania.
