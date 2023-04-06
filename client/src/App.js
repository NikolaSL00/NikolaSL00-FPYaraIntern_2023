import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Container, Row, Col } from 'react-grid-system';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import Home from './pages/Home';
import PrivateRoute from './components/Guards/PrivateRoute';
import PublicRoute from './components/Guards/PublicRoute';

import { Context as AuthContext } from './context/AuthContext';
import SignOut from './pages/SignOut';
import Warehouses from './pages/Warehouses';
import Products from './pages/ProductsPage';
import Movements from './pages/Movements';

const App = () => {
  const { getUserIfCookieAvailable } = useContext(AuthContext);

  useEffect(() => {
    getUserIfCookieAvailable();
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
              <Route path="/" element={<Home />} />
              <Route path="/signout" element={<SignOut />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/products" element={<Products />} />
              <Route path="/movements" element={<Movements />} />
            </Route>
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
