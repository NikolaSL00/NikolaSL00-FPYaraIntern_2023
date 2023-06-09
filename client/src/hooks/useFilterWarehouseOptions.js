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
    const options = warehouses.filter(
      (warehouse) => warehouse.id !== parseInt(source)
    );
    setFilteredWarehouseDestinationOptions(() => options);
  };

  useEffect(() => {
    filterWarehouseDestinationOptions();
  }, [destination, warehouses]);

  const filterWarehouseDestinationOptions = () => {
    const options = warehouses.filter(
      (warehouse) => warehouse.id !== parseInt(destination)
    );
    setFilteredWarehouseSourceOptions(() => options);
  };

  return [filteredWarehouseSourceOptions, filteredWarehouseDestinationOptions];
};
