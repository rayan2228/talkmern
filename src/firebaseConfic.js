// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv6rDVv_8lqdRRSRR3O9sYhYBl6LiuZRY",
  authDomain: "talkmern.firebaseapp.com",
  projectId: "talkmern",
  storageBucket: "talkmern.appspot.com",
  messagingSenderId: "770817326417",
  appId: "1:770817326417:web:dea9b98ab99cf879e7e770"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig