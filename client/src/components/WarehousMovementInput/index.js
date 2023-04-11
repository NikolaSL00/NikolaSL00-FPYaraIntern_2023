import './WarehouseMovementInput.css';
import { useState } from 'react';
import Button from '../common/Button';

import WarehouseMovements from '../WarehouseMovements';

const WarehouseMovementInput = ({
  title,
  warehouses,
  defaultOption,
  value,
  onChange,
}) => {
  const renderOptions = warehouses.map((warehouse) => {
    return (
      <option key={warehouse.id} value={warehouse.id}>
        {warehouse.name}
      </option>
    );
  });
  const [showModal, setShowModal] = useState(false);

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
    <div className="warehouse-movement-input-wrapper">
      <label>{title}</label>
      <select
        className="warehouse-movements-select"
        value={value}
        onChange={(e) => onChange(e)}
      >
        <option value="null">{defaultOption}</option>
        {renderOptions}
      </select>
      <div>{value !== 'null' && renderDetails()}</div>
    </div>
  );
};

export default WarehouseMovementInput;
