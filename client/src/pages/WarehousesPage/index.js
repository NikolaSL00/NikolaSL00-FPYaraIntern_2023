import './WarehousesPage.css';

import { useContext, useEffect, useState } from 'react';
import { Context as WarehouseContext } from '../../context/WarehouseContext';
import WarehouseCard from '../../components/WarehouseCard';
import FloatingButton from '../../components/common/FloatingButton';
import WarehouseAddForm from '../../components/WarehouseAddForm';

const WarehousesPage = () => {
  const { state, getWarehouses, removeWarehouse } =
    useContext(WarehouseContext);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getWarehouses();
  }, []);

  const onClose = () => {
    setShowModal(false);
  };
  const render = state.warehouses.map((warehouse) => {
    return (
      <WarehouseCard
        key={warehouse.id}
        warehouse={warehouse}
        onDelete={removeWarehouse}
      />
    );
  });

  const modal = <WarehouseAddForm onClose={onClose} />;

  return (
    <div className="warehouses-page-container">
      <div className="warehouses-container">{render}</div>
      <FloatingButton
        title="Add Warehouse"
        onClick={() => setShowModal(true)}
      />
      {showModal && modal}
    </div>
  );
};

export default WarehousesPage;
