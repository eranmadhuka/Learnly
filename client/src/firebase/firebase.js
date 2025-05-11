// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyByluQo17Gg_zYjNWNDpXDpe2QvfF9a74Q",
    authDomain: "learnly-a1b21.firebaseapp.com",
    projectId: "learnly-a1b21",
    storageBucket: "learnly-a1b21.firebasestorage.app",
    messagingSenderId: "518484503614",
    appId: "1:518484503614:web:a481b8ebb60a15da90f56f",
    measurementId: "G-KRCBE8TPBQ"
  };
  

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


export { storage };