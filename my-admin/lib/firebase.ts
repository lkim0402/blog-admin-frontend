// this is the config file!!

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// blog admin web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY6hEPBmsSkGiG1O1lw9kuq0dVxKu8y_E",
  authDomain: "blog-admin-d027e.firebaseapp.com",
  projectId: "blog-admin-d027e",
  storageBucket: "blog-admin-d027e.firebasestorage.app",
  messagingSenderId: "1032586564641",
  appId: "1:1032586564641:web:4f9fddfb8655d9496c7f60",
  measurementId: "G-7VQ6QZEG9M",
};

// initializing Firebase & auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
