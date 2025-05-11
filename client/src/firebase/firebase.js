// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
<<<<<<< HEAD
    apiKey: "AIzaSyByluQo17Gg_zYjNWNDpXDpe2QvfF9a74Q",
    authDomain: "learnly-a1b21.firebaseapp.com",
    projectId: "learnly-a1b21",
    storageBucket: "learnly-a1b21.firebasestorage.app",
    messagingSenderId: "518484503614",
    appId: "1:518484503614:web:a481b8ebb60a15da90f56f",
    measurementId: "G-KRCBE8TPBQ"
  };
  
=======
    apiKey: "AIzaSyDj0Z3ktAkIZ2jmAvq0__ltfm0W58AY7NE",
    authDomain: "learnly-46fc6.firebaseapp.com",
    projectId: "learnly-46fc6",
    storageBucket: "learnly-46fc6.firebasestorage.app",
    messagingSenderId: "635282624617",
    appId: "1:635282624617:web:689f29297f1644d18c12f8",
    measurementId: "G-DT18ZB0HD6"
};
>>>>>>> main

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

<<<<<<< HEAD

=======
>>>>>>> main
export { storage };