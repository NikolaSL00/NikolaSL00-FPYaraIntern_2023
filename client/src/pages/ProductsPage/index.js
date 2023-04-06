import './ProductsPage.css';
import { useContext, useEffect, useState } from 'react';
import { Context as ProductContext } from '../../context/ProductContext';

import SortableTable from '../../components/SortableTable';
import SearchBar from '../../components/SearchBar';
import { useSearch } from '../../hooks/useSearch';
import ProductForm from '../../components/ProductForm';

const config = [
  {
    label: 'Name',
    render: (product) => product.name,
    sortValue: (product) => product.name,
  },
  {
    label: 'Width',
    render: (product) => product.width,
    sortValue: (product) => parseFloat(product.width),
  },
  {
    label: 'Height',
    render: (product) => product.height,
    sortValue: (product) => parseFloat(product.height),
  },
  {
    label: 'Length',
    render: (product) => product.length,
    sortValue: (product) => parseFloat(product.length),
  },
  {
    label: 'Volume',
    render: (product) => product.volume,
    sortValue: (product) => parseFloat(product.volume),
  },
  {
    label: 'Price',
    render: (product) => product.price,
    sortValue: (product) => parseFloat(product.price),
  },
  {
    label: 'Type',
    render: (product) => product.type,
    sortValue: (product) => product.type,
  },
];

const Products = () => {
  const {
    state: { products },
    getProducts,
  } = useContext(ProductContext);

  const [search, searchedProducts, searchHandler, filterProducts] =
    useSearch(products);

  useEffect(() => {
    getProducts();
    console.log(products);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, products]);

  const tableContent =
    searchedProducts.length > 0 ? (
      <SortableTable
        data={searchedProducts}
        keyFn={(product) => product.id}
        config={config}
      />
    ) : (
      <div className="not-found-div">
        <p>No products match the search criteria</p>
      </div>
    );

  return (
    <div className="content-container-products-page">
      <div className="form-add-product-container">
        <ProductForm />
      </div>
      <div className="table-searchbar-container">
        <SearchBar value={search} onChange={searchHandler} />
        {tableContent}
      </div>
    </div>
  );
};

export default Products;
