import './ProductMovementList.css';
import { GrClose } from 'react-icons/gr';

const ProductMovementList = ({ transferProducts, setTransferProducts }) => {
  const deleteListItemHandler = (product) => {
    setTransferProducts((curr) =>
      curr.filter((currProduct) => currProduct.id !== product.id)
    );
  };

  const renderedProducts = transferProducts.map((product) => {
    return (
      <li className="products-list-el" key={product.id}>
        <div className="list-item">
          {' '}
          <p>
            {product.name} - {product.type} type - {product.quantity} pieces
          </p>
          <GrClose size={20} onClick={() => deleteListItemHandler(product)} />
        </div>
      </li>
    );
  });

  return (
    <div>
      <h2>Products:</h2>
      <ul className="products-list">{renderedProducts}</ul>
    </div>
  );
};

export default ProductMovementList;
