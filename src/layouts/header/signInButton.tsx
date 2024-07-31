import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { User } from '../../types';
import useCommonStore from '../../stores/common';

const SignInButton = () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        useCommonStore.getState().setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        } as User);
      } else {
        useCommonStore.getState().setUser(null);
      }
    });
  }, [auth]);

  const signIn = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) return;
        const user = result.user;
        console.debug('user signed in', user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  };

  return (
    <button className="signInButton" onClick={signIn}>
      Sign In
    </button>
  );
};

export default SignInButton;
