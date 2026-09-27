/**
 * GOOGLE APPS SCRIPT BACKEND FOR ANDROID 16 SECURITY CLEANER
 * 
 * Instructiuni de configurare:
 * 1. Mergi la https://script.google.com/ si creeaza un proiect nou.
 * 2. Lipeste acest cod in editorul de script.
 * 3. Apasa pe "Deploy" -> "New deployment".
 * 4. Selecteaza tipul: "Web app".
 * 5. La "Execute as", alege: "Me".
 * 6. La "Who has access", alege: "Anyone" (sau "Anyone with Google account").
 * 7. Copiaza URL-ul generat (ex: https://script.google.com/macros/s/AKfycb.../exec)
 * 8. Pune acest URL in campul Webhook URL din aplicatia Web.
 */

function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter || {};
    }

    // Deschide Sheet-ul activ sau creeaza unul nou
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    if (!doc) {
      doc = SpreadsheetApp.create("Android_Security_Logs");
    }
    var sheet = doc.getActiveSheet();

    // Daca sheet-ul este gol, adauga antetul (Headers)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Data & Ora",
        "Dispozitiv / User Agent",
        "Platforma",
        "Nivel Baterie",
        "In Incarcare",
        "Rezolutie Ecran",
        "Nuclee CPU",
        "RAM Estimat (GB)",
        "Limba",
        "Fusu Orar",
        "IP Public",
        "Locatie / ISP",
        "Stare Amenintare"
      ]);
      // Formatare antet
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
    }

    // Adaugare rand cu datele colectate
    sheet.appendRow([
      new Date().toLocaleString("ro-RO"),
      data.userAgent || "Necunoscut",
      data.platform || "Android",
      (data.batteryLevel !== undefined ? data.batteryLevel + "%" : "N/A"),
      (data.isCharging !== undefined ? (data.isCharging ? "DA" : "NU") : "N/A"),
      data.screenResolution || "N/A",
      data.cpuCores || "N/A",
      data.ramGB || "N/A",
      data.language || "N/A",
      data.timezone || "N/A",
      data.ip || "N/A",
      data.org || data.city || "N/A",
      data.threatStatus || "Virus detectat & Curatat"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Datele au fost inregistrate cu succes!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Android 16 Security Cleaner Webhook Active!");
}
