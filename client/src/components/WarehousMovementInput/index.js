import './WarehouseMovementInput.css';

import Button from '../common/Button';

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

  const renderDetails = () => {
    const warehouse = warehouses.filter(
      (warehouse) => warehouse.id === parseInt(value)
    )[0];
    return (
      <>
        <p className="p-warehouse-details">Volume: {warehouse.volume}</p>
        <p className="p-warehouse-details">
          Free volume: {warehouse.volumeLimit - warehouse.volume}
        </p>
        <p className="p-warehouse-details">Type: {warehouse.type}</p>
        <Button className="btn-movements-history">History of movements</Button>
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
