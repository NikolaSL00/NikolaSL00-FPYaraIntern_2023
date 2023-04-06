import './Header.css';
import { Row, Col } from 'react-grid-system';
import { useNavigate } from 'react-router';
import logo from '../../assets/images/warehouse-logo.avif';

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <Col id="header-left-col" md={1} onClick={() => navigate('/warehouses')}>
        <Row
          id="image-row"
          gutterWidth={0}
          direction="row"
          align="center"
          justify="center"
        >
          <img id="logo" src={logo} alt="logo" />
        </Row>
      </Col>

      <Col id="header-right-col" md={11}>
        <Row gutterWidth={0} align="center" justify="center">
          <h1 id="header-title">Warehouse Management</h1>
        </Row>
      </Col>
    </>
  );
};

export default Header;
