import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Container, Row, Col } from 'react-grid-system';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PrivateRoute from './components/Guards/PrivateRoute';
import PublicRoute from './components/Guards/PublicRoute';
import { Context as AuthContext } from './context/AuthContext';

import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SignOutPage from './pages/SignOutPage';
import WarehousesPage from './pages/WarehousesPage';
import Products from './pages/ProductsPage';
import MovementsPage from './pages/MovementsPage';
// import NotFound from './pages/NotFound';

const App = () => {
  const navigate = useNavigate();
  const { getUserIfCookieAvailable } = useContext(AuthContext);

  useEffect(() => {
    getUserIfCookieAvailable(() => {
      navigate('/warehouses');
    });
  }, []);

  return (
    <Container id="container" fluid>
      <Row gutterWidth={0} id="header-row" style={{ height: '10vh' }}>
        <Header />
      </Row>

      <Row gutterWidth={0} id="second-row">
        <Col id="sidebar-column" md={1}>
          <Sidebar />
        </Col>

        <Col id="content-column" md={11}>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/signout" element={<SignOutPage />} />
              <Route path="/warehouses" element={<WarehousesPage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/movements" element={<MovementsPage />} />
            </Route>

            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
