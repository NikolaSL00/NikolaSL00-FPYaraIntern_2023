import './Products.css';
import { useContext, useEffect } from 'react';
import { Context as ProductContext } from '../../context/ProductContext';

import SortableTable from '../../components/SortableTable';

const config = [
  {
    label: 'Name',
    render: (product) => product.name,
    sortValue: (product) => product.name,
  },
  {
    label: 'Width',
    render: (product) => product.width,
    sortValue: (product) => product.width,
  },
  {
    label: 'Height',
    render: (product) => product.height,
    sortValue: (product) => product.height,
  },
  {
    label: 'Length',
    render: (product) => product.length,
    sortValue: (product) => product.length,
  },
  {
    label: 'Volume',
    render: (product) => product.volume,
    sortValue: (product) => product.volume,
  },
  {
    label: 'Price',
    render: (product) => product.price,
    sortValue: (product) => product.price,
  },
  {
    label: 'Type',
    render: (product) => product.type,
    sortValue: (product) => product.type,
  },
];

const Products = () => {
  const { state, getProducts } = useContext(ProductContext);

  useEffect(() => {
    getProducts();
  }, [state.products]);

  return (
    <div className="content-container-products">
      {state.products.length && (
        <SortableTable
          data={state.products}
          keyFn={(product) => product.id}
          config={config}
        />
      )}
    </div>
  );
};

export default Products;
