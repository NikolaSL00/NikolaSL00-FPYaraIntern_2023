import './WarehouseMovementInput.css';
import { useState } from 'react';
import Button from '../common/Button';

import WarehouseMovements from '../WarehouseMovements';
import Select from '../common/Select';

const WarehouseMovementInput = ({
  title,
  warehouses, // all warehouses
  defaultOption, // first option with null value
  value, // useState value
  onChange, // onChange setState
}) => {
  const [showModal, setShowModal] = useState(false);

  const renderOptions = warehouses.map((warehouse) => {
    return (
      <option key={warehouse.id} value={warehouse.id}>
        {warehouse.name}
      </option>
    );
  });

  const defaultOptionNull = <option value="null">{defaultOption}</option>;

  const warehouse = warehouses.filter(
    (warehouse) => warehouse.id === parseInt(value)
  )[0];

  const modal = (
    <WarehouseMovements
      warehouse={warehouse}
      onClose={() => setShowModal(false)}
    />
  );

  const renderDetails = () => {
    return (
      <>
        <p className="p-warehouse-details">Volume: {warehouse.volume}</p>
        <p className="p-warehouse-details">
          Free volume: {warehouse.volumeLimit - warehouse.volume}
        </p>
        <p className="p-warehouse-details">Type: {warehouse.type}</p>
        <Button
          className="btn-movements-history"
          onClick={() => setShowModal(true)}
        >
          History of movements
        </Button>
        {showModal && modal}
      </>
    );
  };

  return (
    <Select
      title={title}
      defaultOption={defaultOptionNull}
      options={renderOptions}
      value={value}
      onChange={onChange}
      withDefaultOption={true}
    >
      {<div>{value !== 'null' && renderDetails()}</div>}
    </Select>
  );
};

export default WarehouseMovementInput;
