import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';

const Winners = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { winners: initialWinners, csvFile } = location.state;
  
  const [winners, setWinners] = useState(initialWinners);
  const [newNumberOfWinners, setNewNumberOfWinners] = useState('');

  const handleRerunDraw = () => {
    if (!newNumberOfWinners) {
      toast.error('Please enter the number of winners.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const csvData = reader.result;
      const parsedData = Papa.parse(csvData, { header: true });
      const data = parsedData.data;

      // Shuffle the data
      const shuffledData = data.sort(() => 0.5 - Math.random());

      // Select new winners
      const newWinners = shuffledData.slice(0, newNumberOfWinners);
      setWinners(newWinners);
    };
    reader.readAsText(csvFile);
  };

  const handleEndDraw = () => {
    toast.success('Draw has ended.');
    setTimeout(() => {
      navigate('/dashboard'); // Navigate to the dashboard route
    }, 2000); // Delay for 2 seconds to show the toast message
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Winners</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {winners.length > 0 && Object.keys(winners[0]).map((key, idx) => (
              <th key={idx} className="py-2 px-4 border-b">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {winners.map((winner, idx) => (
            <tr key={idx} className="text-center">
              {Object.values(winner).map((value, idx) => (
                <td key={idx} className="py-2 px-4 border-b">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Uploaded CSV File</h3>
        <p>{csvFile.name}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Rerun Draw</h3>
        <input
          type="number"
          value={newNumberOfWinners}
          onChange={(e) => setNewNumberOfWinners(e.target.value)}
          className="w-96 p-3 border rounded bg-slate-300 mb-4"
          placeholder="Enter number of winners"
        />
        <button
          onClick={handleRerunDraw}
          className="py-2 px-4 bg-blue-500 text-white rounded"
        >
          Rerun Draw
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={handleEndDraw}
          className="py-2 px-4 bg-red-500 text-white rounded"
        >
          End Draw
        </button>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default Winners;
