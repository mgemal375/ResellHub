

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_ICIKFFcXADHVqip7ivnMtMoqYQzr9-s",
  authDomain: "react-project-6f30c.firebaseapp.com",
  projectId: "react-project-6f30c",
  storageBucket: "react-project-6f30c.firebasestorage.app",
  messagingSenderId: "316788581150",
  appId: "1:316788581150:web:ced100368f4b7b1c3d9f0f"
};


const app = initializeApp(firebaseConfig);


export const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});


export const firebaseDB = getFirestore(app);


export const firebaseStorage = getStorage(app);
