import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Context as AuthContext } from '../../../context/AuthContext';

const PrivateRoute = () => {
  const {
    state: { user },
  } = useContext(AuthContext);

  if (!user) {
    return <Navigate to={'/signin'} replace />;
  }

  return <Outlet />;
};
export default PrivateRoute;
