import "./Form.css";
import { useNavigate } from "react-router";
import Button from "../Button";
import Input from "../Input";

const Form = ({
  className,
  title,
  btnText,
  linkText,
  linkPath,
  inputs,
  onSubmit,
  error,
}) => {
  const navigate = useNavigate();
  const renderedInputs = inputs.map((input, index) => {
    const autofocus = index === 0;
    if (input.type === "select") {
      return (
        <div className="select-container">
          <label>{input.text}</label>
          <select
            className="type-selection"
            onChange={(e) => input.onChange(e.target.value)}
            value={input.value}
          >
            {input.options.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }
    return (
      <Input
        autoFocus={autofocus}
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
    <div className={`content-container-auth ${className}`}>
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
    </div>
  );
};

export default Form;
