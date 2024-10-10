import { app, auth } from "./firebase/firebaseConfig.js";
import { GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js"

const database = getDatabase(app);
const referenceInDB = ref(database, "messages");

const sendBtn = document.querySelector('#send-button');
const messageInput = document.querySelector('#message-input');
const ulEl = document.querySelector('#messages');
const removeBtn = document.querySelector("#remove-btn");

const authContainer = document.getElementById('auth-container');
const signInTemplate = document.querySelector('#sign-in-template');
const mainContent = document.querySelector('#main-content');
const signOutBtn = document.querySelector("#sign-out-btn");

function auth_google_provider() {
    return new GoogleAuthProvider();
}

async function auth_google_sign_in() {
    try {
        const provider = auth_google_provider();
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error during Google sign in:", error);
    }
}

async function auth_sign_out() {
    try {
        await signOut(auth);
        console.log("User signed out successfully");
    } catch (error) {
        console.error("Error signing out:", error);
    }
}

function showSignIn() {
    authContainer.innerHTML = '';
    authContainer.appendChild(signInTemplate.content.cloneNode(true));
    const googleSignInBtn = authContainer.querySelector('#google-sign-in');
    googleSignInBtn.addEventListener('click', auth_google_sign_in);
}

if (signOutBtn) {
    signOutBtn.addEventListener('click', auth_sign_out);
} else {
    console.error("Sign out button not found in the DOM");
}

auth.onAuthStateChanged(user => {
    if (user) {
        console.log(`User is signed in: ${user.email}`);
        authContainer.style.display = 'none';
        mainContent.style.display = 'block';
        signOutBtn.style.display = 'block';
    } else {
        console.log('User is signed out');
        authContainer.style.display = 'block';
        mainContent.style.display = 'none';
        signOutBtn.style.display = 'none';
        showSignIn(); // Show sign-in form by default when logged out
    }
});

document.addEventListener('DOMContentLoaded', showSignIn);

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

onValue(referenceInDB, (snapshot) => {
    if (snapshot.exists()) {
        const messages = Object.values(snapshot.val());
        render(messages);
    } else {
        render([]);
    }
});

messageInput.addEventListener('input', () => {
    adjustTextareaHeight();
    toggleSendButton();
});
messageInput.addEventListener('keypress', handleSend);
sendBtn.addEventListener('click', handleSend);
removeBtn.addEventListener('click', clearData);