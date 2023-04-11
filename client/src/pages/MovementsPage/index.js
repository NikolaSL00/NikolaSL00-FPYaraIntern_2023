import './MovementsPage.css';
import { useState, useContext } from 'react';

import { HiArrowLongRight } from 'react-icons/hi2';
import WarehouseMovementInput from '../../components/WarehousMovementInput';
import DatePicker from '../../components/DatePicker';

import { dateFormatter } from '../../helpers/dateFormatter';
import { useFilterWarehouseOptions } from '../../hooks/useFilterWarehouseOptions';
import { Context as WarehouseContext } from '../../context/WarehouseContext';

const MovementsPage = () => {
  const {
    state: { warehouses },
  } = useContext(WarehouseContext);

  const [date, setDate] = useState('');
  const [source, setSource] = useState('null');
  const [destination, setDestination] = useState('null');
  const [filteredSource, filteredDestination] = useFilterWarehouseOptions(
    warehouses,
    source,
    destination
  );

  return (
    <div className="movement-page-container">
      <div className="movement-page-warehouses-container">
        <WarehouseMovementInput
          title="From:"
          warehouses={filteredSource}
          defaultOption="Unknown Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <div className="date-container-wrapper">
          <HiArrowLongRight size={50} />
          <DatePicker
            required={true}
            value={date}
            onChange={(date) => setDate(date)}
          />
        </div>
        <WarehouseMovementInput
          title="To:"
          warehouses={filteredDestination}
          defaultOption="Unknown Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div className="movement-page-products-container"></div>
    </div>
  );
};

export default MovementsPage;
