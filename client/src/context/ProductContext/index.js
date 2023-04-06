import createDataContext from '../createDataContext';
import { restApi } from '../../api/restApi';

const GET_ALL_PRODUCTS = 'get_all_products';
const ERROR = 'error';
const CLEAR_ERROR_MSG = 'clear_error';

const productReducer = (state, action) => {
  switch (action.type) {
    case ERROR:
      return { ...state, errorMessage: action.payload };
    case CLEAR_ERROR_MSG:
      return { ...state, errorMessage: '' };
    case GET_ALL_PRODUCTS:
      return { errorMessage: '', products: action.payload };
    default:
      return state;
  }
};

const getProducts = (dispatch) => async (callback) => {
  try {
    const response = await restApi.get('/products');

    dispatch({ type: GET_ALL_PRODUCTS, payload: response.data });

    if (callback) {
      callback();
    }
  } catch (err) {
    dispatch({ type: ERROR, payload: err.response.data.message });
  }
};
const addProduct =
  (dispatch) => async (name, width, height, length, price, type, callback) => {
    try {
      await restApi.post('/products', {
        name,
        width: parseFloat(width),
        height: parseFloat(height),
        length: parseFloat(length),
        price: parseFloat(price),
        type,
      });

      const response = await restApi.get('/products');

      dispatch({ type: GET_ALL_PRODUCTS, payload: response.data });
      if (callback) {
        callback();
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: ERROR, payload: err.response.data.message[0] });
    }
  };
const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: CLEAR_ERROR_MSG });
};

export const { Provider, Context } = createDataContext(
  productReducer,
  { getProducts, addProduct, clearErrorMessage },
  { products: [], errorMessage: '' }
);
