import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { isValidEmail, isPasswordsMatching } from '../../helpers/validators';
import AuthForm from '../../components/AuthForm';
import { Context as AuthContext } from '../../context/AuthContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  useEffect(() => {
    setError(() => state.errorMessage);
  }, [state.errorMessage]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setError(() => '');
    if (
      !isPasswordsMatching(password, confirmPassword, setError) ||
      !isValidEmail(email, setError)
    ) {
      return;
    }

    clearErrorMessage();
    signup(email.trim(), password.trim(), () => {
      navigate('/');
    });
  };

  const inputs = [
    {
      type: 'text',
      text: 'Email',
      required: true,
      value: email,
      onChange: setEmail,
    },
    {
      type: 'password',
      text: 'Password',
      required: true,
      value: password,
      onChange: setPassword,
    },
    {
      type: 'password',
      text: 'Confirm Password',
      required: true,
      value: confirmPassword,
      onChange: setConfirmPassword,
    },
  ];

  return (
    <AuthForm
      inputs={inputs}
      title="Sign Up"
      btnText="Sign Up"
      linkText="Already have an account? Sign in instead!"
      linkPath="/signin"
      error={error}
      onSubmit={onSubmit}
    />
  );
};

export default SignUpPage;
