// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore/lite';
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxNuy4P0VGOGMx9nSrHrbe2rDk72YZLP8",
  authDomain: "sticky-wall-todos.firebaseapp.com",
  projectId: "sticky-wall-todos",
  storageBucket: "sticky-wall-todos.appspot.com",
  messagingSenderId: "1052872363231",
  appId: "1:1052872363231:web:718c2940fc96bdfd2bed6a",
  measurementId: "G-WV5MLLJP2M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export {analytics, auth , firestore, storage}