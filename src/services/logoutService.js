import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully");
    }
    catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

export const logoutService = {
    logout,
};