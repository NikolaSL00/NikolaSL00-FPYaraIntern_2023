import { useState, useContext, useEffect } from 'react';

import { Context as WarehouseContext } from '../../context/WarehouseContext';
import { isNumeric } from '../../helpers/validators';
import Modal from '../common/Modal';
import WarehouseForm from '../WarehouseForm';

const WarehouseAddForm = ({ onClose }) => {
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
  ];
  const selectOptions = {
    options: ['normal', 'hazardous'],
    value: type,
    onChange: (e) => setType(e.target.value),
  };

  const resetFormValues = () => {
    setName('');
    setAddress('');
    setVolumeLimit('');
    setType('');
  };
  const onSubmit = (e) => {
    e.preventDefault();

    setError(() => '');

    if (!isNumeric(volumeLimit, 'Volume Limit', setError)) {
      return;
    }

    clearErrorMessage();
    addWarehouse(name.trim(), address.trim(), volumeLimit, type, () => {
      resetFormValues();
      onClose();
    });
  };

  useEffect(() => {
    setError(() => state.errorMessage);
  }, [state.errorMessage]);

  return (
    <Modal onClose={onClose} onSubmit={addWarehouse}>
      <WarehouseForm
        inputs={inputs}
        selectOptions={selectOptions}
        title="Add Warehouse"
        btnText="Add"
        error={error}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};

export default WarehouseAddForm;
