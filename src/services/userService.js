import { get, ref, set } from "firebase/database";
import { auth, database, firestore } from "../config/firebase";
import {
    doc,
    setDoc,
    serverTimestamp,
    getDoc,
    collection,
    getDocs,
    updateDoc
} from "firebase/firestore";

const saveUser = async (user) => {
    try {
        const userRef = doc(firestore, "users", user.uid);
        await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            contactNumber: user.contactNumber,
            uid: user.uid,
            createdAt: serverTimestamp(),  // Better than new Date().toISOString()
        }, { merge: true });  // Merge data instead of overwrite

        console.log("✅ User saved successfully");
    } catch (error) {
        console.error("❌ Error saving user:", error);
        throw error;
    }
};

const fetchUser = async (uid) => {
    try {
        const userRef = doc(firestore, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() };
        } else {
            console.log("No such user!");
            return null;
        }
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        throw error;
    }
};


const fetchAllUsers = async () => {
    try {
        const usersRef = collection(firestore, "users");
        const userSnap = await getDocs(usersRef);
        if (userSnap.empty) {
            console.log("No users found!");
            return [];
        }
        return userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("❌ Error fetching all users:", error);
        throw error;
    }
};


const changeName = async (uid, newName) => {
    try {
        const userRef = doc(firestore, "users", uid);
        await setDoc(userRef, { displayName: newName }, { merge: true });
        console.log("✅ Name updated successfully");
    } catch (error) {
        console.error("❌ Error updating name:", error);
        throw error;
    }
};

const addUpdateAbout = async (uid, about) => {
    try {
        const userRef = doc(firestore, "users", uid);
        await setDoc(userRef, { about }, { merge: true });
        console.log("✅ About section updated successfully");
    } catch (error) {
        console.error("❌ Error updating about section:", error);
        throw error;
    }
};

export const userService = {
    saveUser,
    fetchUser,
    changeName,
    addUpdateAbout,
    fetchAllUsers,
    
    
};
