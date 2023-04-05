import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Context as AuthContext } from '../../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const {
    state: { user },
  } = useContext(AuthContext);

  if (user) {
    return <Navigate to={'/'} replace />;
  }

  return children ? children : <Outlet />;
};

export default PublicRoute;
