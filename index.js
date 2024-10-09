import { app, auth } from "./firebase/firebaseConfig.js";
import { GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js"

const database = getDatabase(app);
const referenceInDB = ref(database, "messages");

const sendBtn = document.querySelector('#send-button');
const messageInput = document.querySelector('#message-input');
const ulEl = document.querySelector('#messages');
const removeBtn = document.querySelector("#remove-btn");
const signInBtn = document.querySelector("#sign-in-btn");
const signOutBtn = document.querySelector("#sign-out-btn");

const render = (messages) => {
    const listItems = messages.map(message => `<li>${message}</li>`).join('');
    ulEl.innerHTML = listItems;
}

const toggleButtonState = (button, isEnabled) => {
    button.disabled = !isEnabled;
    button.classList.toggle('enabledBtn', isEnabled);
    button.classList.toggle('disabledBtn', !isEnabled);
}

const toggleSendButton = () => {
    toggleButtonState(sendBtn, messageInput.value.trim() !== '');
}

const adjustTextareaHeight = () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = `${messageInput.scrollHeight}px`;
}

const sendMessage = () => {
    if (messageInput.value) {
        push(referenceInDB, messageInput.value);
        messageInput.value = '';
        toggleSendButton();
    }
}

const handleSend = (e) => {
    if (e.type === 'click' || (e.type === 'keypress' && e.key === 'Enter')) {
        e.preventDefault();
        sendMessage();
    }
}

const clearData = () => remove(referenceInDB);

const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

const handleSignOut = () => {
    signOut(auth)
        .then(() => console.log("Sign out success"))
        .catch((error) => console.log(error));
}

onValue(referenceInDB, (snapshot) => {
    if (snapshot.exists()) {
        const messages = Object.values(snapshot.val());
        render(messages);
    } else {
        render([]);
    }
});

auth.onAuthStateChanged(user => {
    console.log(user ? `User is signed in: ${user.email}` : 'User is signed out');
});

messageInput.addEventListener('input', () => {
    adjustTextareaHeight();
    toggleSendButton();
});
messageInput.addEventListener('keypress', handleSend);
sendBtn.addEventListener('click', handleSend);
removeBtn.addEventListener('click', clearData);
signInBtn.addEventListener('click', handleGoogle);
signOutBtn.addEventListener('click', handleSignOut);