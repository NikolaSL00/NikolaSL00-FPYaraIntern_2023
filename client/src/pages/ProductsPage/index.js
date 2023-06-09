import './ProductsPage.css';
import { useContext, useEffect } from 'react';
import { Context as ProductContext } from '../../context/ProductContext';

import SortableTable from '../../components/common/SortableTable';
import SearchBar from '../../components/common/SearchBar';
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
        isScrollable={true}
      />
    ) : (
      <div className="not-found-div">
        {products.length > 0 && <p>No products match the search criteria</p>}
        {products.length === 0 && <p>There are no products yet</p>}
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
