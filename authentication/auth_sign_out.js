import { signOut } from "firebase/auth";

export async function auth_sign_out(auth) {
    try {
        await signOut(auth);
        // Sign-out successful.
    } catch (error) {
        // An error happened.
        throw error;
    }
}