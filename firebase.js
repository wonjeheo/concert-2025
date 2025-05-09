// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1Eu7J2TKIHrSEgXOgpx1MtFJl1Mf_qkM",
  authDomain: "rgb-concert-2025.firebaseapp.com",
  projectId: "rgb-concert-2025",
  storageBucket: "rgb-concert-2025.appspot.com",
  messagingSenderId: "115852919819",
  appId: "1:115852919819:web:75eb7a680def470206b30e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc, increment, arrayUnion };