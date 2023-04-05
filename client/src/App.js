import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useContext, useEffect } from 'react';

import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Home from './pages/Home';
import PrivateRoute from './components/Guards/PrivateRoute';
import PublicRoute from './components/Guards/PublicRoute';

import { Context as AuthContext } from './context/AuthContext';

const App = () => {
  const { getUserIfCookieAvailable } = useContext(AuthContext);

  useEffect(() => {
    getUserIfCookieAvailable();
  }, []);

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default App;
