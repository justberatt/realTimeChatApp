import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyCJBKNFZ6pvSwuwH1ms0Ca3w8p-P0c97WY",
    authDomain: "real-time-chat-app-57ee0.firebaseapp.com",
    projectId: "real-time-chat-app-57ee0",
    storageBucket: "real-time-chat-app-57ee0.appspot.com",
    messagingSenderId: "487240951338",
    appId: "1:487240951338:web:49d0381b54839c929f0553"
  };


const app = initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();