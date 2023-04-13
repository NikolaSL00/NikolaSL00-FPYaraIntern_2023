import './ProductMovementInput.css';
import { useState, useContext, useEffect } from 'react';

import Select from '../common/Select';
import Input from '../../components/common/Input';
import Button from '../common/Button';
import { Context as ProductContext } from '../../context/ProductContext';
import { isPositiveInteger } from '../../helpers/validators';
import { restApi } from '../../api/restApi';

const ProductMovementInput = ({ source, setTransferProducts }) => {
  const {
    state: { products },
    getProducts,
  } = useContext(ProductContext);

  const [productId, setProductId] = useState('null');
  const [quantity, setQuantity] = useState(0);
  const [quantityError, setQuantityError] = useState('');
  const [warehouseProducts, setWarehouseProducts] = useState(products);

  useEffect(() => {
    getProducts();
    if (source !== 'null') {
      (async () => {
        const response = await restApi.get(`/warehouses/${source}/prodInfo`);
        const warehouseProds = response.data.productsQuantity;

        const matchingProducts = [];
        for (const [id, quantity] of Object.entries(warehouseProds)) {
          const product = products.filter(
            (product) => product.id === parseInt(id)
          )[0];
          matchingProducts.push({ ...product, quantity });
        }
        setWarehouseProducts(() => matchingProducts);
      })();
    } else {
      setWarehouseProducts(() => products);
    }
  }, [source]);

  useEffect(() => {
    setProductId('null');
  }, [source]);

  const product = warehouseProducts.filter(
    (product) => product.id === parseInt(productId)
  )[0];
  const renderOptions = warehouseProducts.map((product) => {
    return (
      <option key={product.id} value={product.id}>
        {product.name}
      </option>
    );
  });
  const defaultOption = (
    <option value="null" disabled hidden>
      Select product
    </option>
  );
  const renderDetails = () => {
    return (
      <>
        {product.quantity && (
          <p className="p-product-details">
            Available quantity: {product.quantity}
          </p>
        )}
        <p className="p-product-details">Volume: {product.volume}</p>
        <p className="p-product-details">Type: {product.type}</p>
      </>
    );
  };

  const isDisabled = productId === 'null' || quantity === '';

  const onSubmitAddProductHandler = (e) => {
    e.preventDefault();

    if (!isPositiveInteger(quantity, 'Quantity', setQuantityError)) {
      return;
    }

    setTransferProducts((curr) => {
      const filterForSimilarity = curr.filter(
        (currProduct) => currProduct.id !== productId
      );
      return [
        ...filterForSimilarity,
        { id: productId, quantity, name: product.name, type: product.type },
      ];
    });
    setQuantity(0);
    setProductId('null');
  };

  return (
    <div className="product-movements-container">
      <form
        className="product-movements-inputs"
        onSubmit={onSubmitAddProductHandler}
      >
        <Select
          className="product-movements-select"
          title={'Product to Transfer'}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          options={renderOptions}
          withDefaultOption={true}
          defaultOption={defaultOption}
        >
          {<div>{productId !== 'null' && renderDetails()}</div>}
        </Select>

        <div className="product-movements-input-wrapper">
          <Input
            className="product-movements-input"
            text="Quantity"
            required={true}
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantityError('');
              setQuantity(e.target.value);
            }}
          />
          {quantityError && <p className="quantity-error">{quantityError}</p>}
        </div>

        <Button className="product-movements-btn" disabled={isDisabled}>
          Add
        </Button>
      </form>
    </div>
  );
};

export default ProductMovementInput;
