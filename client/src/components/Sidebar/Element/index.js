import { Row } from 'react-grid-system';

const Element = ({ text, path }) => {
  return (
    <>
      <Row
        className="nav-element-row"
        gutterWidth={0}
        justify="center"
        align="center"
        direction="column"
      >
        <div className="nav-element-div">
          <i className="fa-solid fa-arrow-right"></i>
        </div>
        <div>
          <p>{text}</p>
        </div>
      </Row>
    </>
  );
};

export default Element;
