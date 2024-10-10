import { GoogleAuthProvider } from "firebase/auth";

export function auth_google_provider() {
    return new GoogleAuthProvider();
}