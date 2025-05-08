// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDj0Z3ktAkIZ2jmAvq0__ltfm0W58AY7NE",
    authDomain: "learnly-46fc6.firebaseapp.com",
    projectId: "learnly-46fc6",
    storageBucket: "learnly-46fc6.firebasestorage.app",
    messagingSenderId: "635282624617",
    appId: "1:635282624617:web:689f29297f1644d18c12f8",
    measurementId: "G-DT18ZB0HD6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };