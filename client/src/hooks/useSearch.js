import { useState } from 'react';

export const useSearch = (products) => {
  const [searchedProducts, setSearchedProducts] = useState(products);
  const [search, setSearch] = useState('');

  const searchHandler = (value) => {
    setSearch(() => value);
  };

  const filterProducts = () => {
    console.log(products);
    setSearchedProducts(() =>
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  return [search, searchedProducts, searchHandler, filterProducts];
};
