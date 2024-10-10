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
        // Optionally, you can add additional actions here after sign-out
    } catch (error) {
        console.error("Error signing out:", error);
    }
}

function showSignIn() {
    authContainer.innerHTML = `
        <div class="auth-box">
            <h1>Welcome to ChatApp</h1>
            <p>Connect and chat with friends in real-time!</p>
            <button id="google-sign-in" class="google-sign-in">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo">
                Sign in with Google
            </button>
        </div>
    `;
    const googleSignInBtn = authContainer.querySelector('#google-sign-in');
    googleSignInBtn.addEventListener('click', auth_google_sign_in);
}

if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
        console.log("Sign out button clicked");
        auth_sign_out();
    });
} else {
    console.error("Sign out button not found in the DOM");
}

auth.onAuthStateChanged(user => {
    if (user) {
        console.log(`User is signed in: ${user.email}`);
        authContainer.style.display = 'none';
        mainContent.style.display = 'block';
        if (signOutBtn) {
            signOutBtn.style.display = 'block';
        }
    } else {
        console.log('User is signed out');
        authContainer.style.display = 'block';
        mainContent.style.display = 'none';
        if (signOutBtn) {
            signOutBtn.style.display = 'none';
        }
        showSignIn();
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

function checkSignOutButton() {
    const signOutBtn = document.querySelector("#sign-out-btn");
    if (signOutBtn) {
        console.log("Sign-out button exists");
        console.log("Sign-out button display:", window.getComputedStyle(signOutBtn).display);
        console.log("Sign-out button position:", signOutBtn.getBoundingClientRect());
    } else {
        console.log("Sign-out button does not exist in the DOM");
    }
}