// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbknvIO-87ff0lOCSUHtJlPs_CyhkTDnE",
  authDomain: "dls-competition.firebaseapp.com",
  projectId: "dls-competition",
  storageBucket: "dls-competition.firebasestorage.app",
  messagingSenderId: "855283628558",
  appId: "1:855283628558:web:c7c4335e13da16a8775a5f",
  measurementId: "G-1CFJFVHBXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
