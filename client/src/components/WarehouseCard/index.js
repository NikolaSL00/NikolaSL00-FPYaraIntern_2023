import './WarehouseCard.css';
import { BiMap } from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { FaEdit } from 'react-icons/fa';

const WarehouseCard = ({ warehouse, onDelete }) => {
  const { id, name, type, address, volumeLimit, volume } = warehouse;

  return (
    <div id={id} className="card">
      <div className="card-controls">
        <FaEdit size={22} color="#685206" className="clickable-control" />
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
    </div>
  );
};

export default WarehouseCard;
