import createDataContext from '../createDataContext';
import { restApi } from '../../api/restApi';

const ERROR = 'add_error';
const SIGNIN = 'signin';
const SIGNOUT = 'signout';
const CLEAR_ERROR_MSG = 'clear_err_msg';

const authReducer = (state, action) => {
  switch (action.type) {
    case ERROR:
      return { ...state, errorMessage: action.payload };
    case SIGNIN:
      return { errorMessage: '', user: action.payload };
    case CLEAR_ERROR_MSG:
      return { ...state, errorMessage: '' };
    case SIGNOUT:
      return { user: null, errorMessage: '' };
    default:
      return state;
  }
};

const signup = (dispatch) => async (email, password, callback) => {
  try {
    const response = await restApi.post('/auth/signup', { email, password });

    dispatch({ type: SIGNIN, payload: response.data });
    callback();
  } catch (err) {
    dispatch({ type: ERROR, payload: err.response.data.message });
  }
};
const signin = (dispatch) => async (email, password, callback) => {
  try {
    const response = await restApi.post('/auth/signin', { email, password });

    dispatch({ type: SIGNIN, payload: response.data });
    callback();
  } catch (err) {
    dispatch({ type: ERROR, payload: err.response.data.message });
  }
};
const signout = (dispatch) => async (callback) => {
  try {
    await restApi.get('/auth/signout');
    dispatch({ type: SIGNOUT });
    callback();
  } catch (err) {
    dispatch({ type: ERROR, payload: err.response.data.message });
  }
};
const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: CLEAR_ERROR_MSG });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signup, signout, clearErrorMessage },
  { user: null, errorMessage: '' }
);
