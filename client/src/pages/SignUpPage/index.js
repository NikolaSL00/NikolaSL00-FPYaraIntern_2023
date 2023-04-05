import { useState } from 'react';
import AuthForm from '../../components/AuthForm';

import { isValidEmail, isPasswordsMatching } from '../../helpers/validators';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();

    setError(() => '');
    isPasswordsMatching(password, confirmPassword, setError);
    isValidEmail(email, setError);

    // send request
    console.log(email, password, confirmPassword);
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
