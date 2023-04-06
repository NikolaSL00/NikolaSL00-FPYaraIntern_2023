import './SearchBar.css';

import Input from '../Input';
import { ImSearch } from 'react-icons/im';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-bar-container">
      <div className="search-icon-wrapper">
        <ImSearch />
      </div>
      <Input
        className="products-searchbar"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
