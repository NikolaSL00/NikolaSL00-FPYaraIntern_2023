import './authForm.css';
import { useNavigate } from 'react-router';
import Button from '../Button';
import Input from '../Input';

const AuthForm = ({
  title,
  btnText,
  linkText,
  linkPath,
  inputs,
  onSubmit,
  error,
}) => {
  const navigate = useNavigate();
  const renderedInputs = inputs.map((input) => {
    return (
      <Input
        key={input.text}
        type={input.type}
        text={input.text}
        value={input.value}
        required={input.required}
        onChange={(e) => input.onChange(e.target.value)}
      />
    );
  });

  return (
    <div className="auth-form-container">
      <h3 className="auth-form-header">{title}</h3>

      <form className="auth-form" onSubmit={onSubmit}>
        {renderedInputs}
        {error && (
          <div className="auth-form-error-container">
            <p className="auth-form-error">{error}</p>
          </div>
        )}
        <Button className="auth-form-button">{btnText}</Button>
      </form>
      <div
        className="auth-form-link-clickable"
        onClick={() => navigate(linkPath)}
      >
        <p className="auth-form-link">{linkText}</p>
      </div>
    </div>
  );
};

export default AuthForm;