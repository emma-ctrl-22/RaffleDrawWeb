import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';

const Winners = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { draw } = location.state;

  const [winners, setWinners] = useState([]);
  const [savedWinners, setSavedWinners] = useState([]);
  const [remainingWinners, setRemainingWinners] = useState(0);

  useEffect(() => {
    const fetchCsvFile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000${draw.FilePath}`);
        const csvFile = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          const csvData = reader.result;
          const parsedData = Papa.parse(csvData, { header: true });
          const msisdnData = [...new Set(parsedData.data.map(row => row.Msisdn).filter(Boolean))]; // Extracting unique Msisdn values
          const shuffledData = msisdnData.sort(() => 0.5 - Math.random());
          const initialWinners = shuffledData.slice(0, draw.numberOfWinners);
          setWinners(initialWinners);
          setRemainingWinners(draw.numberOfWinners);
        };
        reader.readAsText(csvFile);
      } catch (error) {
        console.error('Error fetching CSV file:', error);
      }
    };

    fetchCsvFile();
  }, [draw.FilePath, draw.numberOfWinners]);

  const handleAddWinner = (msisdn) => {
    setSavedWinners([...savedWinners, msisdn]);
    setWinners(winners.filter(winner => winner !== msisdn));
    setRemainingWinners(remainingWinners - 1);
  };

  const handleRerunDraw = () => {
    const fetchCsvFile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000${draw.FilePath}`);
        const csvFile = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          const csvData = reader.result;
          const parsedData = Papa.parse(csvData, { header: true });
          const msisdnData = [...new Set(parsedData.data.map(row => row.Msisdn).filter(Boolean))]; // Extracting unique Msisdn values
          const shuffledData = msisdnData.sort(() => 0.5 - Math.random());
          const newWinners = shuffledData.slice(0, remainingWinners);
          setWinners(newWinners);
        };
        reader.readAsText(csvFile);
      } catch (error) {
        console.error('Error fetching CSV file:', error);
      }
    };

    fetchCsvFile();
  };

  const handleEndDraw = async () => {
    const payload = savedWinners.map(msisdn => ({ msisdn, drawId: draw.id }));

    try {
      const response = await fetch('http://127.0.0.1:3000/winners/add-winners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winners: payload }),
      });

      if (!response.ok) {
        throw new Error('Failed to save winners');
      }

      toast.success('Draw has ended and winners have been saved.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast.error('Error saving winners: ' + error.message);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6 p-4 bg-gray-100 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{draw.DrawName}</h2>
        <p><strong>Spin Time:</strong> {draw.SpinTime}</p>
        <p><strong>Draw Type:</strong> {draw.DrawType}</p>
        <p><strong>Coverage:</strong> {draw.DrawCoverage}</p>
        <p><strong>Region:</strong> {draw.RCName}</p>
        <p><strong>Setting:</strong> {draw.DrawSetting}</p>
        <p><strong>Prize:</strong> {draw.priceSelection}</p>
        <p><strong>Status:</strong> {draw.status}</p>
      </div>
      <h2 className="text-2xl font-bold mb-4">Winners</h2>
      <table className="min-w-full bg-white border border-gray-200 mb-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Msisdn</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner, idx) => (
            <tr key={idx} className="text-center">
              <td className="py-2 px-4 border-b">{winner}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleAddWinner(winner)}
                  className="py-1 px-3 bg-green-500 text-white rounded"
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-2xl font-bold mb-4">Saved Winners</h2>
      <table className="min-w-full bg-white border border-gray-200 mb-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Msisdn</th>
          </tr>
        </thead>
        <tbody>
          {savedWinners.map((savedWinner, idx) => (
            <tr key={idx} className="text-center">
              <td className="py-2 px-4 border-b">{savedWinner}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Uploaded CSV File</h3>
        <p>{draw.FilePath.split('/').pop()}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Rerun Draw</h3>
        <input
          type="number"
          value={remainingWinners}
          readOnly
          className="w-96 p-3 border rounded bg-slate-300 mb-4"
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
          Save Draw
        </button>
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default Winners;
