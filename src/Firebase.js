import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBkVxLtgxLtBmglQO8HdmeNUVC1fejoLv4",
  authDomain: "attendace-app-8c4f5.firebaseapp.com",
  projectId: "attendace-app-8c4f5",
  storageBucket: "attendace-app-8c4f5.appspot.com",
  messagingSenderId: "834146742233",
  appId: "1:834146742233:web:0ceb722f2a42167261f3c8",
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
