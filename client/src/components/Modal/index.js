import './Modal.css';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { GrClose } from 'react-icons/gr';

const Modal = ({ onClose, children }) => {
  useEffect(() => {
    document.body.classList.add('modal-hidden');

    return () => {
      document.body.classList.remove('modal-hidden');
    };
  }, []);

  return ReactDOM.createPortal(
    <div>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        {children}
        <div className="modal-controls">
          <GrClose className="modal-close" size={40} onClick={onClose} />
        </div>
      </div>
    </div>,
    document.querySelector('.modal-container')
  );
};

export default Modal;
