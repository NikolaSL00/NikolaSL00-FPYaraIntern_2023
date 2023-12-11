import "./ProductForm.css";
import { useState, useContext, useEffect } from "react";

import Form from "../common/Form";
import { Context as ProductContext } from "../../context/ProductContext";
import { isNumeric, isProductOrWarehouseType } from "../../helpers/validators";

const ProductForm = () => {
  const { state, addProduct, clearErrorMessage } = useContext(ProductContext);
  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [length, setLength] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  const inputs = [
    {
      type: "text",
      text: "Name",
      required: true,
      value: name,
      onChange: setName,
    },
    {
      type: "number",
      text: "Width",
      required: true,
      value: width,
      onChange: setWidth,
    },
    {
      type: "number",
      text: "Height",
      required: true,
      value: height,
      onChange: setHeight,
    },
    {
      type: "number",
      text: "Length",
      required: true,
      value: length,
      onChange: setLength,
    },
    {
      type: "number",
      text: "Price",
      required: true,
      value: price,
      onChange: setPrice,
    },
    {
      type: "select",
      text: "Type",
      required: true,
      value: type,
      onChange: setType,
      options: ["normal", "hazardous"],
    },
  ];

  useEffect(() => {
    setError(() => state.errorMessage);
  }, [state.errorMessage]);

  const resetFormValues = () => {
    setName("");
    setWidth("");
    setHeight("");
    setLength("");
    setPrice("");
    setType("");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setError(() => "");

    if (
      !isNumeric(width, "Width", setError) ||
      !isNumeric(height, "Height", setError) ||
      !isNumeric(length, "Length", setError) ||
      !isNumeric(price, "Price", setError) ||
      !isProductOrWarehouseType(type, "Product Type", setError)
    ) {
      return;
    }

    clearErrorMessage();
    addProduct(name.trim(), width, height, length, price, type, () => {
      resetFormValues();
    });
  };

  return (
    <Form
      className="align-content-center"
      inputs={inputs}
      title="Add Product"
      btnText="Add"
      error={error}
      onSubmit={onSubmit}
    />
  );
};

export default ProductForm;
