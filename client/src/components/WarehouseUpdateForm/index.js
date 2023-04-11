import { useState, useContext, useEffect } from 'react';

import { Context as WarehouseContext } from '../../context/WarehouseContext';
import { isNumeric, isProductOrWarehouseType } from '../../helpers/validators';
import Modal from '../common/Modal';
import Form from '../common/Form';

const WarehouseUpdateForm = ({ warehouse, onClose }) => {
  const { state, updateWarehouse, clearErrorMessage } =
    useContext(WarehouseContext);
  const [name, setName] = useState(warehouse.name);
  const [address, setAddress] = useState(warehouse.address);
  const [volumeLimit, setVolumeLimit] = useState(
    parseFloat(warehouse.volumeLimit)
  );
  const [type, setType] = useState(warehouse.type);
  const [error, setError] = useState('');

  const { id } = warehouse;

  useEffect(() => {
    setError(() => state.errorMessage);
  }, [state.errorMessage]);

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
    updateWarehouse(id, name.trim(), address.trim(), volumeLimit, type, () => {
      resetFormValues();
      onClose();
    });
  };

  return (
    <Modal
      onClose={() => {
        clearErrorMessage();
        onClose();
      }}
      onSubmit={updateWarehouse}
    >
      <Form
        inputs={inputs}
        title="Update Warehouse"
        btnText="Update"
        error={error}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};

export default WarehouseUpdateForm;
