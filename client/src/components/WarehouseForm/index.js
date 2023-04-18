import { useNavigate } from 'react-router';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const WarehouseForm = ({
  className,
  title,
  btnText,
  linkText,
  linkPath,
  inputs,
  selectOptions,
  onSubmit,
  error,
}) => {
  const navigate = useNavigate();
  const renderedInputs = inputs.map((input, index) => {
    const autofocus = index === 0;
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
  const renderOptions = selectOptions.options.map((option) => {
    return (
      <option key={option} value={option}>
        {option}
      </option>
    );
  });
  const defaultOptionNull = (
    <option value="" hidden>
      Select warehouse type
    </option>
  );

  return (
    <div className={`content-container-auth ${className}`}>
      <div className="auth-form-container">
        <h3 className="auth-form-header">{title}</h3>

        <form className="auth-form" onSubmit={onSubmit}>
          {renderedInputs}
          <Select
            title="Type"
            options={renderOptions}
            value={selectOptions.value}
            onChange={selectOptions.onChange}
            defaultOption={defaultOptionNull}
            withDefaultOption={true}
            isRequired={true}
          />
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

export default WarehouseForm;
