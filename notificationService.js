const { firestore, messaging } = require("../config/firebase");

let sending = false;

async function sendNotification(alert) {
    
    console.log("sendNotification() called at:", new Date().toISOString());

    if (sending) {
        console.log("Notification already in progress. Skipping...");
        return;
    }

    sending = true;

    try {

        const snapshot = await firestore.collection("fcmTokens").get();

        if (snapshot.empty) {
            console.log("No FCM tokens found.");
            sending = false;
            return;
        }

        const tokens = [];
        const docs = [];

        snapshot.forEach((doc) => {
            tokens.push(doc.data().token);
            docs.push(doc);
        });

        console.log(`Sending notification to ${tokens.length} registered tokens...`);

        const response = await messaging.sendEachForMulticast({
            data: {
                title: alert.title,
                body: alert.body,
            },
            tokens,
        });

        console.log(
            `Success: ${response.successCount}, Failed: ${response.failureCount}`
        );

        for (let i = 0; i < response.responses.length; i++) {

            const result = response.responses[i];

            if (result.success) {
                console.log(`Delivered -> ${docs[i].data().device}`);
            } else {

                console.log("----------------------------");
                console.log("Failed Token:");
                console.log(tokens[i]);
                console.log("Reason:", result.error.code);

                if (
                    result.error.code === "messaging/registration-token-not-registered" ||
                    result.error.code === "messaging/invalid-registration-token"
                ) {
                    await docs[i].ref.delete();
                    console.log("Deleted invalid token.");
                }
            }
        }

    } catch (error) {
        console.error("Notification Error:", error);
    } finally {
        sending = false;
    }
}

module.exports = { sendNotification }; 