// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBnz7IIJrb3jxE_PHUA5cLOgbagZrm1qBA",
  authDomain: "vanguardproxylanding.firebaseapp.com",
  projectId: "vanguardproxylanding",
  storageBucket: "vanguardproxylanding.appspot.com",
  messagingSenderId: "646336671160",
  appId: "1:646336671160:web:YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;