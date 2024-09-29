import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://real-time-chat-app-57ee0-default-rtdb.europe-west1.firebasedatabase.app"

const firebaseConfig = {
    apiKey: "AIzaSyCJBKNFZ6pvSwuwH1ms0Ca3w8p-P0c97WY",
    authDomain: "real-time-chat-app-57ee0.firebaseapp.com",
    projectId: "real-time-chat-app-57ee0",
    storageBucket: "real-time-chat-app-57ee0.appspot.com",
    messagingSenderId: "487240951338",
    appId: "1:487240951338:web:49d0381b54839c929f0553"
  };


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDB = ref(database, "messages")
const auth = firebase.auth();