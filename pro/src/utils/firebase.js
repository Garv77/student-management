// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8kPf48JYXO1HrXbF7Y-Fta1QFS2qkPsU",
  authDomain: "cafe-database-7b7f1.firebaseapp.com",
  databaseURL: "https://cafe-database-7b7f1-default-rtdb.firebaseio.com",
  projectId: "cafe-database-7b7f1",
  storageBucket: "cafe-database-7b7f1.firebasestorage.app",
  messagingSenderId: "693656128659",
  appId: "1:693656128659:web:85e8e46be68ead7e9a1166",
  measurementId: "G-5B9ME7KKE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };