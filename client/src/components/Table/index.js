import './Table.css';
import { Fragment } from 'react';

const Table = ({ data, config, keyFn }) => {
  const renderedRows = data.map((rowData) => {
    const renderedCells = config.map((column, index) => {
      let style =
        index !== 0 ? 'table-cell-align-right' : 'table-cell-align-center';
      return (
        <td className={`table-column-label ${style}`} key={column.label}>
          {column.render(rowData)}
        </td>
      );
    });

    return (
      <tr className="table-row" key={keyFn(rowData)}>
        {renderedCells}
      </tr>
    );
  });

  const renderedHeaders = config.map((column) => {
    if (column.header) {
      return <Fragment key={column.label}>{column.header()}</Fragment>;
    }

    return <th key={column.label}>{column.label}</th>;
  });

  return (
    <table className="table">
      <thead>
        <tr className="table-header-row">{renderedHeaders}</tr>
      </thead>
      <tbody>{renderedRows}</tbody>
    </table>
  );
};

export default Table;
