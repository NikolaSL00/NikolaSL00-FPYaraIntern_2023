import { Row } from 'react-grid-system';

import { GoArrowRight } from 'react-icons/go';

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
          <GoArrowRight color="#685206" size={25} />
        </div>
        <div>
          <p>{text}</p>
        </div>
      </Row>
    </>
  );
};

export default Element;
