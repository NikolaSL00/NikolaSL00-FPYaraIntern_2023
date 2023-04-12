import './MovementsPage.css';
import { useState, useContext, useEffect } from 'react';

import { HiArrowLongRight } from 'react-icons/hi2';
import WarehouseMovementInput from '../../components/WarehousMovementInput';
import DatePicker from '../../components/DatePicker';
import ProductMovementInput from '../../components/ProductMovementInput';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ProductMovementList from '../../components/PorductMovementList';

import { Context as WarehouseContext } from '../../context/WarehouseContext';
import { dateFormatter } from '../../helpers/dateFormatter';
import { useFilterWarehouseOptions } from '../../hooks/useFilterWarehouseOptions';
import { restApi } from '../../api/restApi';

const MovementsPage = () => {
  const {
    state: { warehouses },
    getWarehouses,
  } = useContext(WarehouseContext);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState('');
  const [source, setSource] = useState('null');
  const [destination, setDestination] = useState('null');
  const [transferProducts, setTransferProducts] = useState([]);
  const [filteredSource, filteredDestination] = useFilterWarehouseOptions(
    warehouses,
    source,
    destination
  );
  const [transferError, setTransferError] = useState('');
  const [transferMessage, setTransferMessage] = useState('');

  useEffect(() => {
    if (transferMessage !== '') {
      setShowModal(true);
    }
  }, [transferMessage]);

  useEffect(() => {
    setTransferError('');
  }, [date, source, destination]);

  const onTransferClickHandler = async () => {
    const transferDate = dateFormatter(date);

    const transfers = transferProducts.map((product) => ({
      productId: parseInt(product.id),
      quantity: parseInt(product.quantity),
    }));

    try {
      const body = { transfers, date: transferDate };
      if (source !== 'null') {
        body.sourceId = parseInt(source);
      }
      if (destination !== 'null') {
        body.destinationId = parseInt(destination);
      }
      await restApi.post('/movements', body);
      setTransferMessage(() => 'Successful transfer');
      setDate('');
      setSource('null');
      setDestination('null');
      setTransferProducts([]);
      getWarehouses();
    } catch (err) {
      setTransferError(() => err.response.data.message);
    }
  };

  const isDisabled =
    (source === 'null' && destination === 'null') || date === '';

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

      <div className="movement-page-products-container">
        <ProductMovementInput setTransferProducts={setTransferProducts} />

        {transferProducts.length > 0 && (
          <div className="movement-page-products-list-container">
            <ProductMovementList
              transferProducts={transferProducts}
              setTransferProducts={setTransferProducts}
            />
            <div className="product-movements-btn-wrapper">
              <Button
                onClick={onTransferClickHandler}
                className="btn-transfer"
                disabled={isDisabled}
              >
                Transfer
              </Button>
              {transferError && (
                <p className="transfer-error">{transferError}</p>
              )}
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <Modal
          onClose={() => {
            setTransferMessage('');
            setShowModal(false);
          }}
        >
          <p className="transfer-message">{transferMessage}</p>
        </Modal>
      )}
    </div>
  );
};

export default MovementsPage;
