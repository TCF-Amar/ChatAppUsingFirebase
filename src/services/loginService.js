
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
    }
};

export const loginService = {
  login,
};