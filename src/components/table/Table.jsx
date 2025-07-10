'use client'

import { useState } from 'react';

export default function Table({ tableData }) {

  return (

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg sm:m-4 xl:m-6 2xl:m-8">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              No
            </th>
            <th scope="col" class="px-6 py-3">
              University
            </th>
            <th scope="col" class="px-6 py-3">
              Z-Score
            </th>
            <th scope="col" class="px-6 py-3">
              Province
            </th>
            <th scope="col" class="px-6 py-3">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {
          tableData.map((data, index) => (
            <tr key={index} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td class="px-6 py-4">
                {index + 1}
              </td>
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {data.university}
              </th>
              <td class="px-6 py-4">
                {data.zScore}
              </td>
              <td class="px-6 py-4">
                {data.province}
              </td>
              <td class="px-6 py-4 text-right">
                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Set</a>
              </td>
            </tr>
          ))
          }
          {/* <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td class="px-6 py-4">
              01
            </td>
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              UOM
            </th>
            <td class="px-6 py-4">
              0.1111
            </td>
            <td class="px-6 py-4">
              Western
            </td>
            <td class="px-6 py-4 text-right">
              <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Set</a>
            </td>
          </tr> */}
        </tbody>
      </table>
    </div>

  );
}