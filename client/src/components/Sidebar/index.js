import './Sidebar.css';
import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Row } from 'react-grid-system';
import { useNavigate } from 'react-router';

import { Context as AuthContext } from '../../context/AuthContext';
import Element from './Element';

const color = '#eaeff3';

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
const initStyleValue = {
  signin: 'white',
  signup: 'white',
  signout: 'white',
  warehouses: 'white',
  products: 'white',
  movements: 'white',
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useContext(AuthContext);
  const [style, setStyle] = useState(initStyleValue);

  const resetStyle = () => {
    setStyle((values) => initStyleValue);
  };
  const styleHandler = () => {
    switch (location.pathname) {
      case '/warehouses':
        setStyle((values) => ({ ...values, warehouses: color }));
        break;
      case '/products':
        setStyle((values) => ({ ...values, products: color }));
        break;
      case '/movements':
        setStyle((values) => ({ ...values, movements: color }));
        break;
      case '/signout':
        setStyle((values) => ({ ...values, signout: color }));
        break;
      case '/signup':
        setStyle((values) => ({ ...values, signup: color }));
        break;
      case '/signin':
        setStyle((values) => ({ ...values, signin: color }));
        break;
      default:
        setStyle((values) => ({ ...values, error: color }));
    }
  };

  useEffect(() => {
    resetStyle();
    styleHandler();
  }, [location]);

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
