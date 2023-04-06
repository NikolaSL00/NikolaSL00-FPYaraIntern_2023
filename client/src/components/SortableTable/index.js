import './SortableTable.css';
import { GoArrowSmallDown, GoArrowSmallUp } from 'react-icons/go';
import useSort from '../../hooks/useSort';
import Table from '../Table';

const SortableTable = (props) => {
  const { config, data } = props;

  const { sortOrder, sortBy, sortedData, setSortColumn } = useSort(
    data,
    config
  );

  const updatedConfig = config.map((column) => {
    if (!column.sortValue) {
      return column;
    }

    return {
      ...column,
      header: () => (
        <th
          className="sortable-table-header-cell"
          onClick={() => setSortColumn(column.label)}
        >
          <div className="sortable-table-header-cell-icons">
            {getIcons(column.label, sortBy, sortOrder)}
            {column.label}
          </div>
        </th>
      ),
    };
  });

  return <Table {...props} data={sortedData} config={updatedConfig} />;
};

const getIcons = (label, sortBy, sortOrder) => {
  if (label !== sortBy) {
    return (
      <div>
        <GoArrowSmallUp size={25} />
        <GoArrowSmallDown size={25} />
      </div>
    );
  }

  if (sortOrder === null) {
    return (
      <div>
        <GoArrowSmallUp size={25} />
        <GoArrowSmallDown size={25} />
      </div>
    );
  } else if (sortOrder === 'asc') {
    return (
      <div>
        <GoArrowSmallUp size={25} />
      </div>
    );
  } else if (sortOrder === 'desc') {
    return (
      <div>
        <GoArrowSmallDown size={25} />
      </div>
    );
  }
};

export default SortableTable;
