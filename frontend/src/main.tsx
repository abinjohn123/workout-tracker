import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';

import Home from './Home.tsx';
import './index.css';
import LogWorkout from './pages/log-workout/index.tsx';
import App from './App.tsx';
import GlobalError from './components/GlobalError.tsx';
import { ROUTES } from './routes/index.ts';
import Exercises from './pages/exercises/index.tsx';
import SingleExercise from './pages/exercises/SingleExercise.tsx';
import ExercisesList from './pages/exercises/ExercisesList.tsx';
import { PublicRoute, Auth, ProtectedRoute, AuthContextProvider } from '@/auth';
import Profile from './pages/profile/index.tsx';

const router = createBrowserRouter([
  // public routes
  {
    path: ROUTES.AUTH,
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
    errorElement: <GlobalError />,
  },

  // protected routes
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: ROUTES.PROFILE,
        element: <Profile />,
      },
      {
        path: ROUTES.NEW_WORKOUT,
        element: <LogWorkout />,
      },
      {
        path: ROUTES.EXERCISES,
        element: <Exercises />,
        children: [
          {
            index: true,
            element: <ExercisesList />,
          },
          {
            path: ':exerciseId',
            element: <SingleExercise />,
          },
        ],
      },
    ],
    errorElement: <GlobalError />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthContextProvider>
  </React.StrictMode>,
);
