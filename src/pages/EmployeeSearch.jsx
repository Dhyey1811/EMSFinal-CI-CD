import React, { useState } from 'react';

const EmployeeSearch = ({ setSearchTerm }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput); 
  };

  return (
    <form onSubmit={handleSearch} className="my-4">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} 
        />
        <button className="btn btn-primary" type="submit">Search</button>
      </div>
    </form>
  );
};

export default EmployeeSearch;
