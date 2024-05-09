<<<<<<< HEAD
import React from 'react';
=======
import { useEffect } from 'react';
// import { useEffect, lazy } from 'react';

import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { PrivateRoute } from '../Routs/PrivateRoute';
import { RestrictedRoute } from '../Routs/RestrictedRoute';

import { refreshUser } from '../redux/auth/operations';
import { useAuth } from '../hooks';

import HomePage from '../Pages/HomePage/HomePage';
import SignInPage from '../Pages/SignInPage/SignInPage';
import SignUpPage from '../Pages/SignUpPage/SignUpPage';
import TrackerPage from '../Pages/TrackerPage/TrackerPage';

// const HomePage = lazy(() => import('../Pages/HomePage/HomePage'));
// const SignInPage = lazy(() => import('../Pages/SignInPage/SignInPage'));
// const SignUpPage = lazy(() => import('../Pages/SignUpPage/SignUpPage'));
// const TrackerPage = lazy(() => import('../Pages/TrackerPage/TrackerPage'));
>>>>>>> main

export const App = () => {
  const dispatch = useDispatch();
  const { isRefreshing } = useAuth();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return isRefreshing ? (
    <b>Refreshing user...</b>
  ) : (
    <>
<<<<<<< HEAD
      <div></div>
=======
      <Routes>
        <Route index element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <RestrictedRoute redirectTo="/tracker" component={<SignUpPage />} />
          }
        />

        <Route
          path="/signin"
          element={
            <RestrictedRoute redirectTo="/tracker" component={<SignInPage />} />
          }
        />

        <Route
          path="/tracker"
          element={
            <PrivateRoute redirectTo="/signin" component={<TrackerPage />} />
          }
        />
      </Routes>
      <Toaster />
>>>>>>> main
    </>
  );
};
