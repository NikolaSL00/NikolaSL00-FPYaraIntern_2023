import './Input.css';

const Input = ({ onChange, value, text, type, required, ...props }) => {
  return (
    <div className="user-input-wrp">
      <br />
      <input
        {...props}
        onChange={onChange}
        value={value}
        type={type || 'text'}
        className="inputText"
        required={required}
      />
      <span className="floating-label">{text}</span>
    </div>
  );
};

export default Input;
