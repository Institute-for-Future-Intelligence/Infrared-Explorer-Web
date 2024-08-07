// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { useEffect, useRef, useState } from 'react';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getBlob, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import useCommonStore from '../stores/common';
import { User } from '../types';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(config);

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

  const [imageUrl, setImageSrc] = useState<any>(null);

  // 60889ce5be8811002206f25a
  const read = async () => {
    const reader = new FileReader();

    reader.onloadend = () => {
      imgagesRef.current.push(reader.result);
    };

    for (let i = 1; i <= 20; i++) {
      // const pathReference = ref(storage, `60889ce5be8811002206f25a/data_${i}.png`);
      // const url = await getDownloadURL(pathReference);
      // urlsRef.current.push(url);
      const blob = await getBlob(ref(storage, `60889ce5be8811002206f25a/data_${i}.png`));
      reader.readAsDataURL(blob);
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
        useCommonStore.getState().setUser({
          id: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        } as User);
      } else {
        // User is signed out
        // ...
        setSigned(false);
        console.log('user signed out');
        useCommonStore.getState().setUser(null);
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
  const imgagesRef = useRef<any>([]);

  const next = (n: number) => {
    const next = n + 1;
    if (next > 19) return 0;
    else return next;
  };

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  return (
    <>
      {signed ? <button onClick={handleSignOut}>signOut</button> : <button onClick={signIn}>signIn</button>}

      {signed && (
        <>
          {/* <button onClick={upload}>upload images</button> */}
          <button onClick={read}>fetch</button>
        </>
      )}
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
      {show && <img src={imgagesRef.current[index]} />}
      {/* {show && imageUrl && <img src={imageUrl} />} */}
    </>
  );
};

export default Manager;
