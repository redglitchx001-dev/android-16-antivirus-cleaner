# Android 16 Smart Antivirus & Virus Cleaner (Simulare & Ghid Integrat)

Acest proiect reprezintă o aplicație Web / PWA completă, concepută după cerințele specificate în `cerinte.txt`. Aplicația simulează un instrument autentic de curățare și securizare a virusilor pentru Android 16 (fără root), colectează date de telemetrie de pe dispozitiv și le trimite către un server Google Apps Script, declanșând ulterior un efect dramatic de **glitch / screen tear / crash de sistem**.

---

## 📁 Structura Proiectului

* **`index.html`**: Interfața principală în stil Android 16 Material You Dark Theme (indicator status, circular risk score, carduri telemetrie, buton de acțiune și suprapunere ecrane de eroare/crash).
* **`styles.css`**: Stilurile vizuale avansate, animații CSS de rotație, efect de Screen Tearing, animații de glitching și fereastra de eroare Kernel Panic.
* **`app.js`**: Modulul JS de colectare telemetrie (baterie, IP, ecran, nuclee CPU, RAM, fus orar), integrare sintetizator audio (Web Audio API - fără fișiere externe mp3), API de vibrații și trimitere POST către Webhook.
* **`google_script.gs`**: Codul backend pregătit pentru **Google Apps Script** care salvează datele primite direct într-un tabel **Google Sheets**.

---

## 🚀 Ghid de Configurare Pas cu Pas

### Pasul 1: Configurare Google Apps Script (Backend)
1. Deschide [Google Apps Script](https://script.google.com/) și apasă pe **New project** (Proiect nou).
2. Șterge codul existent și lipeste tot conținutul din fișierul `google_script.gs`.
3. Salvează proiectul (apasa pe pictograma cu dischetă sau `Ctrl+S`).
4. Apasă pe butonul albastru **Deploy** (Extindere) -> **New deployment** (Extindere nouă).
5. Dă click pe pictograma de setări și alege **Web app**.
6. La **Execute as**, selectează **Me** (Adresa ta de Google).
7. La **Who has access**, selectează **Anyone** (Oricine).
8. Apasă pe **Deploy** și acordă permisiunile necesare.
9. Copiază URL-ul Web App generat (exemplu: `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Pasul 2: Rularea Aplicației Web
1. Deschide fișierul `index.html` direct în browser pe telefonul Android sau calculator.
2. În câmpul **Webhook Google Apps Script**, lipește URL-ul copiat de la Pasul 1.
3. Apasă pe butonul **`CURĂȚĂ VIRUSUL ȘI SECURIZEAZĂ`**.

---

## 🎭 Ce se întâmplă la apăsarea butonului?

1. **Scanare & Colectare Date**: Se afișează un modal cu bara de progres. Datele dispozitivului (baterie, rezoluție, IP, nuclee CPU, RAM estimat) sunt colectate.
2. **Trimitere Silentioasa către Google Script**: La ~65% din progres, datele sunt trimise prin HTTP POST către Webhook-ul tău Google Apps Script și salvate automat în Google Sheet.
3. **Efect de Sunet & Vibrații**: Se redă un sunet de avarie sintetizat audio și telefonul vibrează.
4. **Efect Vizual de Crash / Glitch**: Ecranul suferă distorsiuni de culori, rupturi de ecran (*Screen Tearing*) și trece într-un ecran negru de **Kernel Panic (System Fatal Error)**.
