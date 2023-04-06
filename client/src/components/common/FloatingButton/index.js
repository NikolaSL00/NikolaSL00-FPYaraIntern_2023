import './FloatingButton.css';

import Button from '../Button';

const FloatingButton = ({ title, ...props }) => {
  return (
    <Button className="floating-button" {...props}>
      {title}
    </Button>
  );
};

export default FloatingButton;
