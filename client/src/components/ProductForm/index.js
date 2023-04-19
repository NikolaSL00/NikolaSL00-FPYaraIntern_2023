import './ProductForm.css';
import { useState, useContext, useEffect } from 'react';

import Select from '../common/Select';
import Button from '../common/Button';
import Input from '../common/Input';
import { Context as ProductContext } from '../../context/ProductContext';
import { isNumeric, isProductOrWarehouseType } from '../../helpers/validators';

const ProductForm = () => {
  const { state, addProduct, clearErrorMessage } = useContext(ProductContext);
  const [name, setName] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [length, setLength] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setError(() => state.errorMessage);
  }, [state.errorMessage]);

  const typeOptions = ['normal', 'hazardous'];
  const inputs = [
    {
      type: 'text',
      text: 'Name',
      required: true,
      value: name,
      onChange: setName,
    },
    {
      type: 'number',
      text: 'Width',
      required: true,
      value: width,
      onChange: setWidth,
    },
    {
      type: 'number',
      text: 'Height',
      required: true,
      value: height,
      onChange: setHeight,
    },
    {
      type: 'number',
      text: 'Length',
      required: true,
      value: length,
      onChange: setLength,
    },
    {
      type: 'number',
      text: 'Price',
      required: true,
      value: price,
      onChange: setPrice,
    },
  ];
  const resetFormValues = () => {
    setName('');
    setWidth('');
    setHeight('');
    setLength('');
    setPrice('');
    setType('');
  };
  const onSubmit = (e) => {
    e.preventDefault();

    setError(() => '');

    if (
      !isNumeric(width, 'Width', setError) ||
      !isNumeric(height, 'Height', setError) ||
      !isNumeric(length, 'Length', setError) ||
      !isNumeric(price, 'Price', setError) ||
      !isProductOrWarehouseType(type, 'Product Type', setError)
    ) {
      return;
    }

    clearErrorMessage();
    setIsDisabled(true);
    addProduct(name.trim(), width, height, length, price, type, () => {
      resetFormValues();
      setIsDisabled(false);
    });
  };
  const renderedInputs = inputs.map((input, index) => {
    const autofocus = index === 0;
    return (
      <Input
        autoFocus={autofocus}
        key={input.text}
        type={input.type}
        text={input.text}
        value={input.value}
        required={input.required}
        onChange={(e) => input.onChange(e.target.value)}
      />
    );
  });
  const renderOptions = typeOptions.map((option) => {
    return (
      <option key={option} value={option}>
        {option}
      </option>
    );
  });
  const defaultOptionNull = (
    <option value="" hidden>
      Select product type
    </option>
  );
  return (
    <div className="align-content-center">
      <h3>Add product</h3>
      <form className="add-product-form" onSubmit={onSubmit}>
        {renderedInputs}
        <Select
          className="select-add-product"
          title="Product Type"
          options={renderOptions}
          value={type}
          onChange={(e) => setType(e.target.value)}
          defaultOption={defaultOptionNull}
          withDefaultOption={true}
          isRequired={true}
        />
        {error && (
          <div className="auth-form-error-container">
            <p className="auth-form-error">{error}</p>
          </div>
        )}
        <div className="add-product-btn-wrapper">
          <Button className="add-product-btn" disabled={isDisabled}>
            Add product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
