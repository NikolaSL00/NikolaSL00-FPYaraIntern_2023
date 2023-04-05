import './App.css';
import { Routes, Route } from 'react-router-dom';

import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Home from './pages/Home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Routes>
  );
};

export default App;
