import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLevbRWuhTUI115nsQt7dVmzKW7nB1b7Q",
  authDomain: "restaurant-c36fe.firebaseapp.com",
  databaseURL: "https://restaurant-c36fe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "restaurant-c36fe",
  storageBucket: "restaurant-c36fe.firebasestorage.app",
  messagingSenderId: "172358272586",
  appId: "1:172358272586:web:bfb1c58a5d41704161c8b3",
  measurementId: "G-1ZCH1GJG1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
