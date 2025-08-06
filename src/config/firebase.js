// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBQdKXDDooP_XGk-7KxFfOSCMzP8c4aqWY",
  authDomain: "real-time-chat-applicati-85034.firebaseapp.com",
  projectId: "real-time-chat-applicati-85034",
  storageBucket: "real-time-chat-applicati-85034.firebasestorage.app",
  messagingSenderId: "358757766407",
  appId: "1:358757766407:web:f304ad0cfb7fba8d5c21a2",
  measurementId: "G-QH6688MFXV",
  databaseURL: "https://real-time-chat-applicati-85034-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app);