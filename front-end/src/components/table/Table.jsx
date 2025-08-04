'use client'

export default function Table({ tableData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-white border border-gray-600">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 border-b border-gray-600">University</th>
            <th className="px-4 py-2 border-b border-gray-600">Degree</th>
            <th className="px-4 py-2 border-b border-gray-600">District</th>
            <th className="px-4 py-2 border-b border-gray-600">Minimum Z-Score</th>
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((item, index) => (
              <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
                <td className="px-4 py-2">{item.university}</td>
                <td className="px-4 py-2">{item.degree}</td>
                <td className="px-4 py-2">{item.district}</td>
                <td className="px-4 py-2">{item.zscore}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-2 text-center text-gray-400">
                No recommendations available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}