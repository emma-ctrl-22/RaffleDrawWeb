import React from 'react'
import recentResults from '../assets/ResultsData.json'

const ResultsTable = () => {
  return (
    <div className='m-8'>
    <h2 className="text-xl font-bold mb-4">Recent results</h2>
    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead className="text-left">
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">End date</th>
          <th className="py-2 px-4 border-b">Winners drawn</th>
        </tr>
      </thead>
      <tbody>
        {recentResults.map((result, index) => (
          <tr key={index}>
            <td className="py-2 px-4 border-b">{result.name}</td>
            <td className="py-2 px-4 border-b">{result.endDate}</td>
            <td className="py-2 px-4 border-b">
              <button className="bg-yellow-500 text-black py-1 px-3 rounded">{result.winners}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default ResultsTable