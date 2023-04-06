import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Form from '../../components/Form';

import { isValidEmail } from '../../helpers/validators';
import { Context as AuthContext } from '../../context/AuthContext';

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { state, signin, clearErrorMessage } = useContext(AuthContext);

  useEffect(() => {
    setError(() => state.errorMessage);
  }, [state.errorMessage]);

  const onSubmit = (e) => {
    e.preventDefault();

    setError(() => '');
    if (!isValidEmail(email, setError)) {
      return;
    }

    clearErrorMessage();
    signin(email.trim(), password.trim(), () => {
      navigate('/warehouses');
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
  ];

  return (
    <Form
      inputs={inputs}
      title="Sign In"
      btnText="Sign In"
      linkText="Don't have an account? Sign up instead!"
      linkPath="/signup"
      error={error}
      onSubmit={onSubmit}
    />
  );
};

export default SignInPage;
