import { useEffect, useState } from 'react';

export const useFilterWarehouseOptions = (warehouses, source, destination) => {
  const [filteredWarehouseSourceOptions, setFilteredWarehouseSourceOptions] =
    useState(warehouses);
  const [
    filteredWarehouseDestinationOptions,
    setFilteredWarehouseDestinationOptions,
  ] = useState(warehouses);

  useEffect(() => {
    filterWarehouseSourceOptions();
  }, [source, warehouses]);

  const filterWarehouseSourceOptions = () => {
    let sourceWarehouse = warehouses.filter(
      (warehouse) => warehouse.id === parseInt(source)
    )[0];

    let options;
    if (sourceWarehouse) {
      options = warehouses.filter(
        (warehouse) =>
          warehouse.id !== sourceWarehouse.id &&
          warehouse.type === sourceWarehouse.type
      );
    } else {
      options = warehouses.filter(
        (warehouse) => warehouse.id !== parseInt(source)
      );
    }

    setFilteredWarehouseDestinationOptions(() => options);
  };

  useEffect(() => {
    filterWarehouseDestinationOptions();
  }, [destination, warehouses]);

  const filterWarehouseDestinationOptions = () => {
    let destinationWarehouse = warehouses.filter(
      (warehouse) => warehouse.id === parseInt(destination)
    )[0];

    let options;
    if (destinationWarehouse) {
      options = warehouses.filter(
        (warehouse) =>
          warehouse.id !== destinationWarehouse.id &&
          warehouse.type === destinationWarehouse.type
      );
    } else {
      options = warehouses.filter(
        (warehouse) => warehouse.id !== parseInt(destination)
      );
    }
    setFilteredWarehouseSourceOptions(() => options);
  };

  return [filteredWarehouseSourceOptions, filteredWarehouseDestinationOptions];
};
