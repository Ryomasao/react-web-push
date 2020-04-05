import firebase from "./firebase";

export const subscribe = async (worker) => {
  // publicKeyを取得する
  const callableFunction = firebase.functions().httpsCallable("key");
  const { data } = await callableFunction().catch((error) => {
    const errorMessage = "Faied to get public key\n";
    console.error(errorMessage, error);
    return;
  });

  const applicationServerKey = urlB64ToUint8Array(data.publicKey);

  const subscription = await worker.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
    .catch((error) => {
      const errorMessage = "Faied to subscribe the user: \n";
      console.error(errorMessage, error);
    });

  const message = "User is subscribed\n";
  console.log(message, subscription);

  return subscription;
};

export const registerSubscription = async (subscription) => {
  const callableFunction = firebase.functions().httpsCallable("/register");
  await callableFunction({
    pushSubscription: subscription.toJSON(),
  }).catch((error) => {
    const errorMessage = "Faied to registe subscrition \n";
    console.error(errorMessage, error);
  });
};

export const push = async () => {
  const callableFunction = firebase.functions().httpsCallable("/push");
  await callableFunction().catch((error) => {
    console.error(error);
  });
};

const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
