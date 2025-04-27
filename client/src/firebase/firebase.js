// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCTLy3iFqqmbapbTK0H6q5no6HbxJ46U5c",
    authDomain: "learnly-3a747.firebaseapp.com",
    projectId: "learnly-3a747",
    storageBucket: "learnly-3a747.firebasestorage.app",
    messagingSenderId: "1096744750120",
    appId: "1:1096744750120:web:ede40b41b0344c2e62f91d",
    measurementId: "G-FDET98BQWE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);