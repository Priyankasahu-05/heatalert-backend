const { sendNotification } = require("./notificationService");

let lastAlertLevel = null;

function getAlert(avgTemp) {
  if (avgTemp < 35) {
    return {
      level: "SAFE",
      title: "🟢 Weather is Safe",
      body: "Weather conditions are normal. Stay hydrated and enjoy your day."
    };
  }

  if (avgTemp >= 35 && avgTemp < 40) {
    return {
      level: "WARNING",
      title: "🟡 Heatwave Warning",
      body: "Rising temperatures detected. Stay hydrated, limit sun exposure, and take regular breaks in the shade."
    };
  }

  if (avgTemp >= 40 && avgTemp < 45) {
    return {
      level: "HIGH",
      title: "🟠 High Heat Alert",
      body: "High heat levels detected. Reduce outdoor activities, wear light clothing, and stay in cool or shaded areas."
    };
  }

  return {
    level: "EXTREME",
    title: "🔴 Extreme Heat Emergency",
    body: "Dangerous heatwave conditions detected. Stay indoors, avoid strenuous activity, drink plenty of fluids, and seek medical attention if symptoms of heat-related illness occur."
  };
}

function processDevices(devices) {
  const list = Object.values(devices);

  const avgTemp =
    list.reduce((sum, device) => sum + Number(device.temperature_c), 0) /
    list.length;

  const alert = getAlert(avgTemp);

  console.log("\n========== ALERT ==========");
  console.log("Average Temperature :", avgTemp.toFixed(2), "°C");
  console.log("Alert Level :", alert.level);
  console.log("Title :", alert.title);
  console.log("===========================\n");

  if (lastAlertLevel !== alert.level) {

    console.log("New Alert Level Detected");

    sendNotification(alert);

    lastAlertLevel = alert.level;

} else {

    console.log("Same alert level. Notification skipped.");

}
 
}

module.exports = { processDevices };