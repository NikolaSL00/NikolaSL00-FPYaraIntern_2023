import createDataContext from '../createDataContext';
import { restApi } from '../../api/restApi';

const GET_ALL_WAREHOUSES = 'get_all_warehouses';
const ERROR = 'error';
const CLEAR_ERROR_MSG = 'clear_error';

const warehouseReducer = (state, action) => {
  switch (action.type) {
    case ERROR:
      return { ...state, errorMessage: action.payload };
    case CLEAR_ERROR_MSG:
      return { ...state, errorMessage: '' };
    case GET_ALL_WAREHOUSES:
      return { errorMessage: '', warehouses: action.payload };
    default:
      return state;
  }
};

const getWarehouses = (dispatch) => async (callback) => {
  try {
    const response = await restApi.get('/warehouses');

    dispatch({ type: GET_ALL_WAREHOUSES, payload: response.data });

    if (callback) {
      callback();
    }
  } catch (err) {
    dispatch({ type: ERROR, payload: err.response.data.message });
  }
};
const removeWarehouse = (dispatch) => async (id, callback) => {
  try {
    await restApi.delete(`/warehouses/${id}`);

    const response = await restApi.get('/warehouses');

    dispatch({ type: GET_ALL_WAREHOUSES, payload: response.data });
    if (callback) {
      callback();
    }
  } catch (err) {
    dispatch({ type: ERROR, payload: err.message });
  }
};
const updateWarehouse =
  (dispatch) => async (id, name, address, volumeLimit, type, callback) => {
    try {
      await restApi.patch(`/warehouses/${id}`, {
        name,
        address,
        volumeLimit: parseFloat(volumeLimit),
        type,
      });

      const response = await restApi.get('/warehouses');

      dispatch({ type: GET_ALL_WAREHOUSES, payload: response.data });
      if (callback) {
        callback();
      }
    } catch (err) {
      dispatch({ type: ERROR, payload: err.response.data.message[0] });
    }
  };
const addWarehouse =
  (dispatch) => async (name, address, volumeLimit, type, callback) => {
    try {
      await restApi.post('/warehouses', {
        name,
        address,
        volumeLimit: parseFloat(volumeLimit),
        type,
      });

      const response = await restApi.get('/warehouses');

      dispatch({ type: GET_ALL_WAREHOUSES, payload: response.data });
      if (callback) {
        callback();
      }
    } catch (err) {
      dispatch({ type: ERROR, payload: err.response.data.message[0] });
    }
  };
const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: CLEAR_ERROR_MSG });
};

export const { Context, Provider } = createDataContext(
  warehouseReducer,
  {
    getWarehouses,
    addWarehouse,
    removeWarehouse,
    updateWarehouse,
    clearErrorMessage,
  },
  { warehouses: [], errorMessage: '' }
);
