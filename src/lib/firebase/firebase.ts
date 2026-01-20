// src/lib/firebase/firebase.ts

// Import the functions you need from the SDKs you need
// initialize firebase app
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// sdk - each one of the tools or products is a sdk 
// we need to say we are using authentication 
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration - this is an object that contains all the keys and identifiers for your Firebase project
const firebaseConfig = {
    apiKey: "AIzaSyCB-iY70TGGMIV0R-LfybEzRumU2cV-0J8",
    authDomain: "ecommerce-e5c94.firebaseapp.com",
    projectId: "ecommerce-e5c94",
    storageBucket: "ecommerce-e5c94.firebasestorage.app",
    messagingSenderId: "445938229859",
    appId: "1:445938229859:web:db0c0cf3ddaa20939f4e56"
};

// Initialize Firebase - allowing the app to connect to Firebase services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);