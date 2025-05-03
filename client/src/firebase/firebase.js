// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByluQo17Gg_zYjNWNDpXDpe2QvfF9a74Q",
  authDomain: "learnly-a1b21.firebaseapp.com",
  projectId: "learnly-a1b21",
  storageBucket: "learnly-a1b21.firebasestorage.app",
  messagingSenderId: "518484503614",
  appId: "1:518484503614:web:822492be76520b4390f56f",
  measurementId: "G-YXTN8ZVG3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);