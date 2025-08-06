
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { userService } from "./UserService";
import { toast } from "react-hot-toast";
import generateContactNumber from "../utils/contactNo";

const signup = async (name, email, password) => {
    try {
        // Create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Generate a unique contact number
        const contactNumber = generateContactNumber();

        // Prepare the user data with all required fields
        const userData = {
            ...userCredential.user,
            displayName: name,
            contactNumber: contactNumber,
            email: email,
            uid: userCredential.user.uid,
            photoURL: userCredential.user.photoURL || null,
        };

        // Save the user data to Firestore
        await userService.saveUser(userData);
        return userCredential.user;
    } catch (error) {
        console.error("Signup failed:", error);
        let errorMessage = "Signup failed. Please try again.";
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email is already registered.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "Password should be at least 6 characters.";
        }
        
        toast.error(errorMessage);
        throw error;
    }
};

export const signupService = {
    signup,
};