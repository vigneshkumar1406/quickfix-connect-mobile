
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDL98xHU2NNkzHHtMnSlmOqO5-h7_LeoG4",
  authDomain: "quickfix-3970e.firebaseapp.com",
  projectId: "quickfix-3970e",
  storageBucket: "quickfix-3970e.firebasestorage.app",
  messagingSenderId: "511142277126",
  appId: "1:511142277126:web:e81c04a64b3a877b605387",
  measurementId: "G-42T596M3F7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
