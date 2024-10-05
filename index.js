import { app, auth } from "./firebase/firebaseConfig.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js"

const database = getDatabase(app);
const referenceInDB = ref(database, "messages");

const sendBtn = document.querySelector('#send-button');
let messageInput = document.querySelector('#message-input');
const ulEl = document.querySelector('#messages')

const render = (messages) => {
    let listItems = ''
    for (let message of messages) {
        listItems += `
        <li>${message}</li>
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
    if (messageInput.value.trim() !== '') { // trim() is used to remove any leading or trailing whitespace from the input value, so even if the user types just spaces, the button will remain disabled
        sendBtn.disabled = false
        sendBtn.classList.add('enabledBtn');
        sendBtn.classList.remove('disabledBtn');
    }
    else {
        sendBtn.disabled = true;
        sendBtn.classList.remove('enabledBtn');
        sendBtn.classList.add('disabledBtn');
    }
}

//Make the textarea height to grow based on the user input
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto'; // Reset the height
    messageInput.style.height = messageInput.scrollHeight + 'px'; // Set the new height
});

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
        toggleSendButton()
    }
}

const removeBtn = document.querySelector("#remove-btn")

const clearData = () => {
    remove(referenceInDB)
}

const handleGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

const signInBtn = document.querySelector("#sign-in-btn");

messageInput.addEventListener('keypress', handleSend)
messageInput.addEventListener('input', toggleSendButton);
sendBtn.addEventListener('click',  handleSend);
removeBtn.addEventListener('click', clearData);