'use client';
import NavBar from "@/components/nav/NavBar";
import DropDown from "@/components/dropdown/DropDown";
import Table from "@/components/table/Table";
import './globals.css'

import { useRef } from 'react';

export default function Home() {

  const tableRef = useRef();

  const handlePrint = () => {
    const printContents = tableRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>University List</title>');
    printWindow.document.write('<style>table, th, td { border: 1px solid black; border-collapse: collapse; padding: 8px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <NavBar />
      <div>
        <h1 className="text-3xl font-bold text-center mt-10">
          Welcome to Z score base University Finder
        </h1>
      </div>
      {/* O/L Results */}
      <div className="mb-4 m-6 rounded-2xl bg-gray-900 p-8">
        <p className="text-gray-300 text-lg">Select Your O/L Results</p>
        <div className="grid sm:grid-cols-4 grid-cols-1 gap-4 p-4">
          <div>
            <DropDown label={"Subject 01"} />
          </div>
          <div>
            <DropDown label={"Subject 02"} />
          </div>
          <div>
            <DropDown label={"Subject 03"} />
          </div>
          <div>
            <DropDown label={"Subject 04"} />
          </div>
        </div>
      </div>
      {/* A/L Results */}
      <div className="mb-4 m-6 rounded-2xl bg-gray-900 p-8">
        <p className="text-gray-300 text-lg">Select Your A/L Results</p>
        <div className="grid sm:grid-cols-4 grid-cols-1 gap-4 p-4">
          <div>
            <DropDown label={"Subject 01"} />
          </div>
          <div>
            <DropDown label={"Subject 02"} />
          </div>
          <div>
            <DropDown label={"Subject 03"} />
          </div>
          <div>
            <DropDown label={"Subject 04"} />
          </div>
          <div>
            <DropDown label={"Subject 05"} />
          </div>
          <div>
            <DropDown label={"Subject 06"} />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button type="button" class="flex text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900">
            <svg class="w-[28px] h-[28px]text-purple-700 hover:text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M4 4a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2v14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2V5a1 1 0 0 1-1-1Zm5 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1Zm-5 4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Zm-3 4a2 2 0 0 0-2 2v3h2v-3h2v3h2v-3a2 2 0 0 0-2-2h-2Z" clip-rule="evenodd" />
            </svg>

            <span className="p-1">Search University</span> </button>
        </div>
      </div>
      {/* Table Set of Uni */}
      <div className="mb-4 m-6 rounded-2xl bg-gray-900 p-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-300 text-lg">University List</p>
          {/* download btn */}
          <div className="mt-4 flex justify-center mb-4">
            <button onClick={handlePrint} type="button" class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-5 py-2 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
              </svg>
            </button>
          </div>
        </div>
        {/* Table */}
        <div ref={tableRef}>
          <Table tableData={[{
            no: "01",
            university: "UOM",
            zScore: "0.1111",
            province: "Western",
            action: <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Set</a>
          },
          {
            no: "02",
            university: "UOC",
            zScore: "0.1111",
            province: "Western",
            action: <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Set</a>
          },
          {
            no: "03",
            university: "UOK",
            zScore: "0.1111",
            province: "Central",
            action: <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Set</a>
          },
          {
            no: "04",
            university: "DDDD",
            zScore: "0.1111",
            province: "Central",
            action: <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Set</a>
          }

          ]} />
        </div>
      </div>

    </>
  );
}
