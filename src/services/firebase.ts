import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCYbjhyEy9JOrHYVt-43Gj5oQQ9HIsgTyI',
  authDomain: 'infrared-explorer.firebaseapp.com',
  projectId: 'infrared-explorer',
  storageBucket: 'infrared-explorer.appspot.com',
  messagingSenderId: '482530289615',
  appId: '1:482530289615:web:6fb29813458e7c9f80d4ba',
  measurementId: 'G-1EP8H4WQ8Z',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(firebaseApp);

export const firebaseStorage = getStorage();
