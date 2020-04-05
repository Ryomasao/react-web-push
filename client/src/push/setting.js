import firebase from "../services/push";

const SW_URL = `${process.env.PUBLIC_URL}/sw.js`;
// https://web-push-codelab.glitch.me/

export class Woker {
  constructor() {
    this.sw = null;
    this.subscription = null;
    this.publicKey = null;
    if (!("serviceWorker" in navigator && "PushManager" in window)) {
      throw new Error("Service Worker and Push is supported");
    }
  }

  registe = async () => {
    this.sw = await navigator.serviceWorker
      .register(SW_URL)
      .catch(function (error) {
        throw new Error("Service Worker Error", error);
      });
    this.subscribe();
  };

  subscribe = async () => {
    if (Notification.permission === "denied") {
      console.log("Notification permission is denied");
      return;
    }

    const key = firebase.functions().httpsCallable("/key");
    const { data } = await key().catch((error) => {
      console.error("Faied to get public key: ", error);
    });

    this.publicKey = data.publicKey;

    const applicationServerKey = urlB64ToUint8Array(this.publicKey);

    this.subscription = await this.sw.pushManager.getSubscription();

    // すでにsubuscribeしてる
    if (this.subscription !== null) {
      console.log("user is already subscribed", this.subscription);
      this.sendKey();
      return;
    }

    this.subscription = await this.sw.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })
      .catch((error) => {
        console.error("Faied to subscribe the user: ", error);
      });

    console.log("User is subscribed", this.subscription);
    this.sendKey();
  };

  sendKey = async () => {
    const register = firebase.functions().httpsCallable("/register");
    const data = await register({
      pushSubscription: this.subscription.toJSON(),
    }).catch((error) => {
      console.error("Faied to subscribe ", error);
    });
    console.log(data);
  };
}

function urlB64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
