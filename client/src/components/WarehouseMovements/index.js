import { useState, useEffect } from 'react';

import { restApi } from '../../api/restApi';
import Modal from '../common/Modal';
import Table from '../common/Table';

const configImports = [
  {
    label: 'Source',
    render: (imp) => (imp.sourceId === null ? 'unknown source' : imp.sourceId),
  },
  {
    label: 'Date',
    render: (imp) => imp.date,
  },
  {
    label: 'Product id',
    render: (imp) => imp.productId,
  },
  {
    label: 'Quantity',
    render: (imp) => imp.quantity,
  },
];

const configExports = [
  {
    label: 'Destination',
    render: (exp) =>
      exp.destinationId === null ? 'unknown destination' : exp.destinationId,
  },
  {
    label: 'Date',
    render: (exp) => exp.date,
  },
  {
    label: 'Product id',
    render: (exp) => exp.productId,
  },
  {
    label: 'Quantity',
    render: (exp) => exp.quantity,
  },
];

const WarehouseMovements = ({ onClose, warehouse }) => {
  const [imports, setImports] = useState([]);
  const [exports, setExports] = useState([]);
  const [error, setError] = useState('');

  const restructureData = (data) => {
    const movements = [];
    for (let movement of data) {
      for (let product of movement.products) {
        movements.push({
          id: movement.id,
          sourceId: movement.sourceId,
          destinationId: movement.destinationId,
          date: movement.date,
          productId: product.productId,
          quantity: product.quantity,
        });
      }
    }
    return movements;
  };

  useEffect(() => {
    restApi
      .get(`/movements?warehouseId=${warehouse.id}`)
      .then((response) => {
        const movements = restructureData(response.data);
        setImports(() =>
          movements.filter((mov) => mov.destinationId === warehouse.id)
        );
        setExports(() =>
          movements.filter((mov) => mov.sourceId === warehouse.id)
        );
      })
      .catch((err) => {
        setError(() => err.response.data.message);
      });
  }, [warehouse]);

  const children = error ? (
    <p className="auth-form-error">{error}</p>
  ) : (
    <div className="movements-tables-wrapper">
      {imports.length > 0 ? (
        <div className="movements-table-wrapper">
          <h3>Imports</h3>
          <Table
            data={imports}
            config={configImports}
            keyFn={(movement) => `${movement.id}${movement.productId}`}
            isScrollable={false}
          />
        </div>
      ) : (
        <div className="movements-table-wrapper">
          <h3>Imports</h3>
          <p>No imports yet</p>
        </div>
      )}
      {exports.length > 0 ? (
        <div>
          <h3>Exports</h3>
          <Table
            data={exports}
            config={configExports}
            keyFn={(movement) => `${movement.id}${movement.productId}`}
            isScrollable={false}
          />
        </div>
      ) : (
        <div>
          <h3>Exports</h3>
          <p>No exports yet</p>
        </div>
      )}
    </div>
  );

  return (
    <Modal onClose={onClose} className="modal-movements">
      {children}
    </Modal>
  );
};

export default WarehouseMovements;
