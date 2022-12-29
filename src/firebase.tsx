import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = ({
    apiKey: "AIzaSyCoPvjemBrJXFM3wiA-b6KioNrSPd_1cfQ",
    authDomain: "tamidchats.firebaseapp.com",
    projectId: "tamidchats",
    storageBucket: "tamidchats.appspot.com",
    messagingSenderId: "580997875009",
    appId: "1:580997875009:web:c1e8891bb3b66e4d114dc0",
    measurementId: "G-CC2FV4RVHP"
});


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Google Authentication Provider
const provider = new GoogleAuthProvider();

// Initialize Firestore database
const db = getFirestore(app); 

export { app, auth, provider, db }