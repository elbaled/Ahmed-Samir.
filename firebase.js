/* =========================================================
   Samir Portfolio - Firebase Configuration
   ========================================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================================
   Firebase Configuration
   ========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyCXbNB74dy7UqNjxo7Neoge7wHq3-wJA3k",
    authDomain: "samir-portfolio-1535e.firebaseapp.com",
    projectId: "samir-portfolio-1535e",
    messagingSenderId: "668516947884",
    appId: "1:668516947884:web:b2a581c20111c3a1b40c09"
};


/* =========================================================
   Initialize Firebase
   ========================================================= */

const app = initializeApp(firebaseConfig);


/* =========================================================
   Firebase Authentication
   ========================================================= */

const auth = getAuth(app);


/* =========================================================
   Cloud Firestore
   ========================================================= */

const db = getFirestore(app);


/* =========================================================
   Exports
   ========================================================= */

export {
    app,
    auth,
    db
};