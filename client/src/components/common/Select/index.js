const Select = ({
  title,
  value,
  options,
  children,
  onChange,
  withDefaultOption,
  defaultOption,
}) => {
  return (
    <div className="warehouse-movement-input-wrapper">
      <label>{title}</label>
      <select
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
