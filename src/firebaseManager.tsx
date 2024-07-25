// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { useEffect, useRef, useState } from 'react';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getBlob, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: 'AIzaSyARmNyKj3YOoyFrIuLkVqZZBvIhxUaLNUI',
//   authDomain: 'ie-test-fc7d6.firebaseapp.com',
//   projectId: 'ie-test-fc7d6',
//   storageBucket: 'ie-test-fc7d6.appspot.com',
//   messagingSenderId: '653249112564',
//   appId: '1:653249112564:web:1c30560f0e0b8f0956b1a1',
//   measurementId: 'G-6W6GJSTZD4',
// };

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
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage();

const provider = new GoogleAuthProvider();

const Manager = () => {
  const [signed, setSigned] = useState(false);

  const upload = async () => {};

  const blobToImage = (blob: Blob) => {
    return new Promise<HTMLImageElement>((resolve) => {
      const url = URL.createObjectURL(blob);
      let img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.src = url;
    });
  };

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 60889ce5be8811002206f25a
  const read = async () => {
    for (let i = 1; i <= 20; i++) {
      const pathReference = ref(storage, `60889ce5be8811002206f25a/data_${i}.png`);
      const url = await getDownloadURL(pathReference);
      urlsRef.current.push(url);
    }
  };

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
        console.log('user signed in', user);
        setSigned(true);
      } else {
        // User is signed out
        // ...
        setSigned(false);
        console.log('user signed out');
      }
    });
  }, []);

  const signIn = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) return;
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleSignOut = async () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const urlsRef = useRef<string[]>([]);

  const next = (n: number) => {
    const next = n + 1;
    if (next > 19) return 0;
    else return next;
  };

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  return (
    <>
      {signed && (
        <>
          <button onClick={upload}>upload images</button>
          <button onClick={read}>read</button>
        </>
      )}
      <button onClick={signIn}>signIn</button>
      <button onClick={handleSignOut}>signOut</button>
      <button onClick={() => setShow((b) => !b)}>show</button>
      <button onClick={() => setIndex((n) => Math.max(0, n - 1))}>prev</button>
      <button onClick={() => setIndex(next)}>next</button>
      <button
        onClick={() => {
          intervalRef.current = setInterval(() => {
            setIndex(next);
          }, 200);
        }}
      >
        play
      </button>
      <button
        onClick={() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }}
      >
        stop
      </button>
      <div>current index: {index}</div>
      {show && <img src={urlsRef.current[index]} />}
    </>
  );
};

export default Manager;
