import './WarehousesPage.css';

import { useContext, useEffect, useState } from 'react';
import { Context as WarehouseContext } from '../../context/WarehouseContext';
import WarehouseCard from '../../components/WarehouseCard';
import FloatingButton from '../../components/FloatingButton';
import Modal from '../../components/Modal';

const WarehousesPage = () => {
  const { state, getWarehouses, removeWarehouse } =
    useContext(WarehouseContext);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getWarehouses();
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  const modal = <Modal onClose={closeModal}></Modal>;

  const render = state.warehouses.map((warehouse) => {
    return (
      <WarehouseCard
        key={warehouse.id}
        warehouse={warehouse}
        onDelete={removeWarehouse}
      />
    );
  });

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
