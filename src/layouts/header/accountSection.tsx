import { lazy, Suspense } from 'react';
import useCommonStore from '../../stores/common.ts';

const MainMenu = lazy(() => import('../../components/mainMenu/mainMenu.tsx'));
const SignInButton = lazy(() => import('./signInButton.tsx'));

const AccountSection = () => {
  const user = useCommonStore((state) => state.user);

  return (
    <div className="account-section">
      <Suspense>{user ? <MainMenu user={user} /> : <SignInButton />}</Suspense>
    </div>
  );
};

export default AccountSection;
