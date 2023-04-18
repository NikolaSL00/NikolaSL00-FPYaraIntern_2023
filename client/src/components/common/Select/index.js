import './Select.css';
const Select = ({
  title,
  value,
  options,
  children,
  onChange,
  withDefaultOption,
  defaultOption,
  isRequired,
  className,
}) => {
  return (
    <div
      className={`warehouse-movement-input-wrapper ${
        className ? className : ''
      }`}
    >
      <label className="select-label">{title}</label>
      <select
        required={isRequired}
        className="warehouse-movements-select"
        value={value}
        onChange={(e) => onChange(e)}
      >
        {withDefaultOption && defaultOption}
        {options}
      </select>
      {children}
    </div>
  );
};

export default Select;
