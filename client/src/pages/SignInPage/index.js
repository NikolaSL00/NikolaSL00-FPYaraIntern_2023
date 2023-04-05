import { useState } from 'react';
import AuthForm from '../../components/AuthForm';

import { isValidEmail } from '../../helpers/validators';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    setError(() => '');
    isValidEmail(email, setError);

    // send request
    console.log(email, password);
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
    <AuthForm
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
