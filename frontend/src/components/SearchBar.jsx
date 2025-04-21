// src/components/SearchBar.jsx
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
  type="text"
  placeholder="Search products..."
  value={keyword}
  onChange={(e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.trim() === '') {
      onSearch(''); // when input is cleared, call onSearch with empty string
    }
  }}
/>

      <button type="submit">🔍</button>
    </form>
  );
};

export default SearchBar;
