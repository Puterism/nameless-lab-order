import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/storage';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(config);

const auth = new firebase.auth();
const firestore = new firebase.firestore();
const database = new firebase.database();
const storage = new firebase.storage();

const functions = firebase.app().functions('asia-northeast2');

if (window.location.hostname === 'localhost') {
  firestore.settings({
    host: 'localhost:8080',
    ssl: false,
  });

  auth.useEmulator('http://localhost:9099/');
  functions.useEmulator('localhost', 5001);
  storage.useEmulator('localhost', 9199);
}

export { firebase, auth, firestore, database, functions, storage };
