import { useState, useContext, useEffect } from "react";

import { Context as WarehouseContext } from "../../context/WarehouseContext";
import { isNumeric, isProductOrWarehouseType } from "../../helpers/validators";
import Modal from "../common/Modal";
import Form from "../common/Form";

const WarehouseAddForm = ({ onClose }) => {
  const { state, addWarehouse, clearErrorMessage } =
    useContext(WarehouseContext);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [volumeLimit, setVolumeLimit] = useState("");
  const [type, setType] = useState("normal");
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
      type: "text",
      text: "Address",
      required: true,
      value: address,
      onChange: setAddress,
    },
    {
      type: "number",
      text: "Volume Limit",
      required: true,
      value: volumeLimit,
      onChange: setVolumeLimit,
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

  const resetFormValues = () => {
    setName("");
    setAddress("");
    setVolumeLimit("");
    setType("");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    setError(() => "");

    if (
      !isNumeric(volumeLimit, "Volume Limit", setError) ||
      !isProductOrWarehouseType(type, "Warehouse Type", setError)
    ) {
      return;
    }

    clearErrorMessage();
    addWarehouse(name.trim(), address.trim(), volumeLimit, type, () => {
      resetFormValues();
      onClose();
    });
  };

  useEffect(() => {
    setError(() => state.errorMessage);
  }, [state.errorMessage]);

  return (
    <Modal onClose={onClose} onSubmit={addWarehouse}>
      <Form
        inputs={inputs}
        title="Add Warehouse"
        btnText="Add"
        error={error}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};

export default WarehouseAddForm;
