import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRfMvATsbiHLtIReehBjumnwUICwSbk1g",
  authDomain: "miniblog-82001.firebaseapp.com",
  projectId: "miniblog-82001",
  storageBucket: "miniblog-82001.appspot.com",
  messagingSenderId: "206824283603",
  appId: "1:206824283603:web:5b4da8e6c9aa7bbeff2326"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};