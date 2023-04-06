import './Modal.css';
import ReactDOM from 'react-dom';
import { useEffect, useState, useContext } from 'react';
import Button from '../Button';
import Form from '../Form';
import { Context as WarehouseContext } from '../../context/WarehouseContext';
import { isNumeric, isProductOrWarehouseType } from '../../helpers/validators';
import { GrClose } from 'react-icons/gr';

const Modal = ({ onClose }) => {
  const { state, addWarehouse, clearErrorMessage } =
    useContext(WarehouseContext);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [volumeLimit, setVolumeLimit] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');

  const inputs = [
    {
      type: 'text',
      text: 'Name',
      required: true,
      value: name,
      onChange: setName,
    },
    {
      type: 'text',
      text: 'Address',
      required: true,
      value: address,
      onChange: setAddress,
    },
    {
      type: 'number',
      text: 'Volume Limit',
      required: true,
      value: volumeLimit,
      onChange: setVolumeLimit,
    },

    {
      type: 'text',
      text: 'Type',
      required: true,
      value: type,
      onChange: setType,
    },
  ];

  const resetFormValues = () => {
    setName('');
    setAddress('');
    setVolumeLimit('');
    setType('');
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setError(() => '');

    if (
      !isNumeric(volumeLimit, 'Volume Limit', setError) ||
      !isProductOrWarehouseType(type, 'Warehouse Type', setError)
    ) {
      return;
    }

    clearErrorMessage();
    addWarehouse(name.trim(), address.trim(), volumeLimit, type);
    resetFormValues();
    onClose();
  };

  useEffect(() => {
    setError(() => state.errorMessage);
  }, [state.errorMessage]);

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
        <Form
          inputs={inputs}
          title="Add Warehouse"
          btnText="Add"
          error={error}
          onSubmit={onSubmit}
        />
        <div className="modal-controls">
          <GrClose className="modal-close" size={40} onClick={onClose} />
        </div>
      </div>
    </div>,
    document.querySelector('.modal-container')
  );
};

export default Modal;
