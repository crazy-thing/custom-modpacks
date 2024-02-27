import React from 'react';
import './searchbar.css';

const SearchBar = ({ onChange }) => {
  return (
        <input className='searchbar' placeholder='Search' type='text' onChange={(e) => onChange(e.target.value)} />
  )
};

export default SearchBar;