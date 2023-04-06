import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Context as AuthContext } from '../../context/AuthContext';

const SignOutPage = () => {
  const navigate = useNavigate();
  const { signout } = useContext(AuthContext);

  useEffect(() => {
    signout(() => navigate('/'));
  }, []);
};

export default SignOutPage;
