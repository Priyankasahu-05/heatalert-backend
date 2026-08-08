const { initializeApp, cert } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

const serviceAccount = require("../firebase-service-account.json");

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://heatwave-detection-9ba7b-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getDatabase(app);
const firestore = getFirestore(app);
const messaging = getMessaging(app);

module.exports = {
  db,
  firestore,
  messaging,
};