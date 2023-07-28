import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAadPKnZUUCWLOQvGtsQ6g3QGOe7llktqo",
  authDomain: "movie-95190.firebaseapp.com",
  projectId: "movie-95190",
  storageBucket: "movie-95190.appspot.com",
  messagingSenderId: "249913848185",
  appId: "1:249913848185:web:20daed6c02d6631399ffa8",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // Add this line to initialize Firestore

export default app;
