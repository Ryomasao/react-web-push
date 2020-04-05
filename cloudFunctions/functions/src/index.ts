import * as functions from "firebase-functions";

const admin = require("firebase-admin");
admin.initializeApp();

// https://firebase.google.com/docs/functions/callable?hl=ja

export const key = functions.https.onCall(async (data, context) => {
  const snapshot = await admin.database().ref("/key").once("value");
  const keyData = snapshot.val();
  //console.info(`value:${JSON.stringify(snapshot.val())}`);
  return {
    publicKey: keyData ? keyData.public : "failed",
  };
});

export const register = functions.https.onCall((data, context) => {
  //console.info(data.pushSubscription);
  admin.database().ref("token").set(data.pushSubscription);
  return {
    message: "registerd",
  };
});

export const push = functions.https.onCall(async (data, context) => {
  const keySnapshot = await admin.database().ref("/key").once("value");
  const keyData = keySnapshot.val();

  const tokenSnapshot = await admin.database().ref("/token").once("value");
  const token = tokenSnapshot.val();

  const webpush = require("web-push");
  webpush.setVapidDetails(
    "mailto:example@yourdomain.org",
    keyData.public,
    keyData.private
  );

  console.info(token);
  webpush
    .sendNotification(token, "Your Push Payload Text")
    .catch((error: any) => {
      console.error(error);
    });
});
