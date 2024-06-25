// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// Import Authentication
import { getAuth } from 'firebase/auth'
// Import Database
import { getFirestore } from 'firebase/firestore'
// Import Storage
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAX-Fc0NVsxKHByuAw8_nSQpF8lkel8-o8",
  authDomain: "oceanpals-a5bd9.firebaseapp.com",
  projectId: "oceanpals-a5bd9",
  storageBucket: "oceanpals-a5bd9.appspot.com",
  messagingSenderId: "1073716640827",
  appId: "1:1073716640827:web:b855685289bc88d71ab01e",
  measurementId: "G-XQMGQ0CGNQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Accessing Firebase Variables
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);