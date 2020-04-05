import * as firebase from "firebase/app";
import "firebase/functions";
// messagingもfirebaseに完全に乗っかる場合
//import "firebase/messaging";

const config = {
  apiKey: "AIzaSyBBAqlgHvoSUYUL_FsdzjpSGkhGCUX5Dak",
  authDomain: "sample-push-273212.firebaseapp.com",
  databaseURL: "https://sample-push-273212.firebaseio.com",
  projectId: "sample-push-273212",
  storageBucket: "sample-push-273212.appspot.com",
  messagingSenderId: "800821703232",
  appId: "1:800821703232:web:eaace7c0a8dd099e6225a5",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;
