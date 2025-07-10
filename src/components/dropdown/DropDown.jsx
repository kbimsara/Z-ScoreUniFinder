'use client'

import { useState } from 'react';

export default function DropDown({label}) {

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="dropdown" className="block text-sm font-medium text-gray-300 mb-1">
        {label || "Select an option"}
      </label>
      <select
        id="dropdown"
        className="w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        <option value="" disabled selected>
          Choose an option
        </option>
        <option value="option1" className="bg-gray-900 text-white">
          Option 1
        </option>
        <option value="option2" className="bg-gray-900 text-white">
          Option 2
        </option>
        <option value="option3" className="bg-gray-900 text-white">
          Option 3
        </option>
      </select>
    </div>
  );
}