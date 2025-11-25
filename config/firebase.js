/*
const firebaseConfig = {
  apiKey: "AIzaSyBJQQRmYYmb8ZJ6TzCR7gWgh5d9xtqXUnw",
  authDomain: "resellhub-b8c6c.firebaseapp.com",
  projectId: "resellhub-b8c6c",
  storageBucket: "resellhub-b8c6c.firebasestorage.app",
  messagingSenderId: "993779469592",
  appId: "1:993779469592:web:f424ac890ba9743c9b226d",
  measurementId: "G-RKQSV6QK2D"
};
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJQQRmYYmb8ZJ6TzCR7gWgh5d9xtqXUnw",
  authDomain: "resellhub-b8c6c.firebaseapp.com",
  projectId: "resellhub-b8c6c",
  storageBucket: "resellhub-b8c6c.firebasestorage.app",
  messagingSenderId: "993779469592",
  appId: "1:993779469592:web:f424ac890ba9743c9b226d",
  measurementId: "G-RKQSV6QK2D"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

//export { app, auth, db };