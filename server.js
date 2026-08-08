const express = require("express");
const { db } = require("./config/firebase");
const startRealtimeListener = require("./listeners/realtimeListener");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Heatwave Notification Backend Running");
});

// Test Firebase Realtime Database
app.get("/test-db", async (req, res) => {
  try {
    const snapshot = await db.ref("devices").once("value");

    res.json({
      success: true,
      data: snapshot.val()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startRealtimeListener();