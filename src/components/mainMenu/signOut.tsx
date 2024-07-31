import { getAuth, signOut } from 'firebase/auth';

const SignOut = () => {
  const handleSignOut = async () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.debug('user signed out');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return <span onClick={handleSignOut}>Sign Out</span>;
};

export default SignOut;
