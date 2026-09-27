// GOOGLE APPS SCRIPT BACKEND FOR ANDROID 16 SECURITY CLEANER

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var doc = SpreadsheetApp.getActiveSpreadsheet();
    if (!doc) {
      doc = SpreadsheetApp.create("Android_Security_Logs");
    }
    var sheet = doc.getActiveSheet();

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
        "Fus Orar",
        "IP Public",
        "Locatie / ISP",
        "Stare Amenintare"
      ]);
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
    }

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
      .createTextOutput(JSON.stringify({ status: "success", message: "Date inregistrate cu succes!" }))
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
