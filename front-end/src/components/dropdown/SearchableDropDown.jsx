'use client';

import { useState } from 'react';

export default function SearchableDropDown({ label, options, onSelect, value, placeholder }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value || searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
      {searchTerm && filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
