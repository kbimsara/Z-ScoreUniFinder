'use client'

import { useState } from 'react';

export default function DropDown({label, options = [], onSelect}) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="dropdown" className="block text-sm font-medium text-gray-300 mb-1">
        {label || "Select an option"}
      </label>
      <select
        id="dropdown"
        value={selectedValue}
        onChange={handleChange}
        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        <option value="" disabled>
          Choose grade
        </option>
        {options.length > 0 ? (
          options.map((option, index) => (
            <option key={index} value={option} className="bg-gray-900 text-white">
              {option}
            </option>
          ))
        ) : (
          <>
            <option value="A" className="bg-gray-900 text-white">A</option>
            <option value="B" className="bg-gray-900 text-white">B</option>
            <option value="C" className="bg-gray-900 text-white">C</option>
            <option value="S" className="bg-gray-900 text-white">S</option>
          </>
        )}
      </select>
    </div>
  );
}