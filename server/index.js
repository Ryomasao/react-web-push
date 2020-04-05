const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const webpush = require("web-push");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

// VAPID keys should only be generated only once.
// 本来であれば、keyを作っておいて、別途保存しておく
// 今回は、サーバ起動時に毎回つくっちゃう
const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let pushSubscription = null;

app.get("/key", (req, res) => {
  res.json({
    key: vapidKeys.publicKey,
  });
});

app.post("/register", (req, res) => {
  pushSubscription = req.body.pushSubscription;
  console.log(pushSubscription);
  res.json({
    message: "registerd",
  });
});

app.post("/push", (req, res) => {
  webpush
    .sendNotification(pushSubscription, "Your Push Payload Text")
    .then(() => {
      res.json({
        message: "pushed sucess",
      });
    })
    .catch((error) => {
      console.log("error", error);
      res.json({
        message: "pushed failed",
      });
    });
});

app.listen(port);
