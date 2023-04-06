import './WarehouseCard.css';
import { BiMap } from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';
import { useState } from 'react';

import WarehouseUpdateForm from '../WarehouseUpdateForm';

const WarehouseCard = ({ warehouse, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const { id, name, type, address, volumeLimit, volume } = warehouse;

  const onClose = () => {
    setShowModal(false);
  };

  const modal = <WarehouseUpdateForm warehouse={warehouse} onClose={onClose} />;

  return (
    <div id={id} className="card">
      <div className="card-controls">
        <FaEdit
          size={22}
          color="#685206"
          className="clickable-control"
          onClick={() => setShowModal(true)}
        />
        <RiDeleteBin5Line
          size={22}
          color="#685206"
          className="clickable-control"
          onClick={() => onDelete(id)}
        />
      </div>
      <div className="card-content">
        <p className="card-text">Name: {name}</p>
        <p className="card-text">
          Volume: {volume}/{volumeLimit}
        </p>
        <p className="card-text">
          <BiMap size={15} color="#685206" /> {address}
        </p>
        <p className="card-text">Type: {type}</p>
      </div>
      {showModal && modal}
    </div>
  );
};

export default WarehouseCard;
