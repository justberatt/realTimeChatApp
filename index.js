import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://real-time-chat-app-57ee0-default-rtdb.europe-west1.firebasedatabase.app",
    apiKey: "AIzaSyCJBKNFZ6pvSwuwH1ms0Ca3w8p-P0c97WY",
    authDomain: "real-time-chat-app-57ee0.firebaseapp.com",
    projectId: "real-time-chat-app-57ee0",
    storageBucket: "real-time-chat-app-57ee0.appspot.com",
    messagingSenderId: "487240951338",
    appId: "1:487240951338:web:49d0381b54839c929f0553"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const referenceInDB = ref(database, "messages");

const sendBtn = document.querySelector('#send-button');
let messageInput = document.querySelector('#message-input');
const ulEl = document.querySelector('#messages')

const render = (messages) => {
    let listItems = ''
    for (let message of messages) {
        listItems += `
        <li>
            ${message}
        </li>
        `
    }
    ulEl.innerHTML = listItems
}

onValue (referenceInDB, (snapshot) => {
    if (!snapshot.exists()) {
        render('')
        return
    }
    const snapshotValues = snapshot.val();
    const messages = Object.values(snapshotValues);
    render(messages);
})

const toggleSendButton = () => {
    if (messageInput.value.trim() !== '') // trim() is used to remove any leading or trailing whitespace from the input value, so even if the user types just spaces, the button will remain disabled
        sendBtn.disabled = false
    else
        sendBtn.disabled = true;
}

const sendMessage = () => {
    if (messageInput.value) {
        push(referenceInDB, messageInput.value);
        messageInput.value = '';
    }
}

const handleSend = (e) => {
    if (e.type === 'click' || (e.type === 'keypress' && e.key === 'Enter')) {
        e.preventDefault();
        sendMessage();
    }
}

// const removeBtn = document.querySelector("#remove-btn")

// const clearData = () => {
//     remove(referenceInDB)
// }

messageInput.addEventListener('keypress', handleSend)
messageInput.addEventListener('input', toggleSendButton);
sendBtn.addEventListener('click',  handleSend);
// removeBtn.addEventListener('click', clearData);