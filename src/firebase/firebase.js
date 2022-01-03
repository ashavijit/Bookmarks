import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD8U-T6zffMUXUxjF1UY88mQ2Ycz7nkmqM",
  authDomain: "helpmarks-1.firebaseapp.com",
  projectId: "helpmarks-1",
  storageBucket: "helpmarks-1.appspot.com",
  messagingSenderId: "385353768658",
  appId: "1:385353768658:web:33c752e2ccc62f0392d70b",
  measurementId: "G-CYYKY7YVEL"
};
  

const fireApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
export { db, auth, fireApp }