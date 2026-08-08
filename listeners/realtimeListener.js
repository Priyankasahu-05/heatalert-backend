const { db } = require("../config/firebase");
const { processDevices } = require("../services/alertService");

function startRealtimeListener() {
  console.log("Listening for sensor updates...");

  const devicesRef = db.ref("devices");

  devicesRef.on("value", (snapshot) => {
    const devices = snapshot.val();

    if (!devices) {
      console.log("No devices found.");
      return;
    }

    console.clear();
    console.log("========== SENSOR DATA ==========");

    Object.keys(devices).forEach((key) => {
      const device = devices[key];

      console.log({
        device: key,
        location: device.location,
        temperature: device.temperature_c,
        humidity: device.humidity,
        alert: device.alert_level,
      });
    });
     const alert = processDevices(devices);
    console.log("=================================");
  });
}


module.exports = startRealtimeListener;

