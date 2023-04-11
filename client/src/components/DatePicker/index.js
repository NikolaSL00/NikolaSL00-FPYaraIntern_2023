import './DatePicker.css';
const DatePicker = ({ value, onChange, required }) => {
  return (
    <div className="date-container">
      <label htmlFor="dateofmovement">Date of movement</label>
      <input
        className="date-picker"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="date"
        name="dateofmovement"
        id="dateofmovement"
        required={required}
      />
    </div>
  );
};

export default DatePicker;
