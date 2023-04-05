import { useContext, useEffect } from 'react';
import { Context as ProductContext } from '../../context/ProductContext';

const Products = () => {
  const { state, getProducts } = useContext(ProductContext);

  useEffect(() => {
    getProducts();
  }, []);

  const renderProducts = state.products.map((product) => {
    return (
      <div key={product.name}>
        <div>
          <p>{product.name}</p>
        </div>
        <div>
          <p>{product.volume}</p>
        </div>
      </div>
    );
  });

  return <div className="content-container-products">{renderProducts}</div>;
};

export default Products;
