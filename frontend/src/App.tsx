import { Outlet, useNavigate } from 'react-router-dom';
import AppNav from './components/AppNav';
import { useAuthContext } from './auth';
import { useEffect } from 'react';
import { ROUTES } from './routes';
import { REDIRECT_PATH_SESSION_KEY } from './constants';

const App: React.FC = () => {
  const { session } = useAuthContext();
  const navigate = useNavigate();

  // Handle post-login redirect
  useEffect(() => {
    if (session) {
      const redirectPath = sessionStorage.getItem(REDIRECT_PATH_SESSION_KEY);

      if (redirectPath && redirectPath !== ROUTES.AUTH) {
        // Clear the stored path
        sessionStorage.removeItem(REDIRECT_PATH_SESSION_KEY);
        navigate(redirectPath, { replace: true });
      } else {
        // Clear any stale redirect path
        sessionStorage.removeItem(REDIRECT_PATH_SESSION_KEY);
      }
    }
  }, [session, navigate]);

  return (
    <div className="mx-auto flex h-svh max-w-md flex-col bg-slate-50 p-4">
      <Outlet />
      <AppNav />
    </div>
  );
};

export default App;
