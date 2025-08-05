'use client'

import { useState } from 'react';

export default function DropDown({label, options = [], onSelect, isDistric, isStream}) {
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
      <label htmlFor="dropdown" className="block text-sm font-medium text-gray-300 mb-2">
        {label || "Select an option"}
      </label>
      <select
        id="dropdown"
        value={selectedValue}
        onChange={handleChange}
        className="w-full bg-gray-800 text-white border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition py-4"
      >
        {isDistric ? (
          <option value="" disabled>
            Choose District
          </option>
        ) : isStream ? (
          <option value="" disabled>
            Choose Stream
          </option>
        ) : (
          <option value="" disabled>
            Choose Grade
          </option>
        )}
        {options.length > 0 ? (
          options.map((option, index) => (
            <option key={index} value={option} className="bg-gray-800 text-white">
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