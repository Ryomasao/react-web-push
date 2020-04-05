import * as firebase from "firebase/app";
import "firebase/functions";
// messagingもfirebaseに完全に乗っかる場合
//import "firebase/messaging";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABSE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;
