import './Sidebar.css';
import { useContext } from 'react';
import { Row } from 'react-grid-system';
import { useNavigate } from 'react-router';

import { Context as AuthContext } from '../../context/AuthContext';
import Element from './Element';
import { useStyler } from '../../hooks/useStyler';

const authorizedRoutes = [
  { path: '/warehouses', text: 'Warehouses', style: 'warehouses' },
  { path: '/products', text: 'Products', style: 'products' },
  { path: '/movements', text: 'Movements', style: 'movements' },
  { path: '/signout', text: 'Sign Out', style: 'signout' },
];
const unAuthorizedRoutes = [
  { path: '/signup', text: 'Sign Up', style: 'signup' },
  { path: '/signin', text: 'Sign In', style: 'signin' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const [style] = useStyler([...authorizedRoutes, ...unAuthorizedRoutes]);

  const renderRoutes = () => {
    let routes = state.user ? authorizedRoutes : unAuthorizedRoutes;
    return routes.map((route) => {
      return (
        <Row
          key={route.text}
          gutterWidth={0}
          className="sidebar-row"
          justify="center"
          onClick={() => navigate(route.path)}
          style={{
            backgroundColor: `${style[route.style]}`,
          }}
        >
          <Element text={route.text} path={route.path} />
        </Row>
      );
    });
  };

  return <>{renderRoutes()}</>;
};

export default Sidebar;
