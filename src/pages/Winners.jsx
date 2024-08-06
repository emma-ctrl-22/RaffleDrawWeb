import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Winners = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { draw } = location.state;

  const [winners, setWinners] = useState([]);
  const [savedWinners, setSavedWinners] = useState([]);
  const [remainingWinners, setRemainingWinners] = useState(0);
  const [isRaffleComplete, setIsRaffleComplete] = useState(false);

  useEffect(() => {
    const fetchCsvFile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000${draw.FilePath}`);
        const csvFile = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          const csvData = reader.result;
          const parsedData = Papa.parse(csvData, { header: true });
          const msisdnData = [...new Set(parsedData.data.map(row => row.Msisdn).filter(Boolean))];
          const shuffledData = msisdnData.sort(() => 0.5 - Math.random());
          const initialWinners = shuffledData.slice(0, draw.numberOfWinners);
          
          // Simulate raffle animation
          let currentIndex = 0;
          const raffleInterval = setInterval(() => {
            if (currentIndex < initialWinners.length) {
              setWinners(prev => [...prev, initialWinners[currentIndex]]);
              currentIndex++;
              confetti({
                particleCount: 200,
                spread: 70,
                origin: { y: 0.6 }
              });
            } else {
              clearInterval(raffleInterval);
              setIsRaffleComplete(true);
            }
          }, 500);

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
        const response = await fetch(`https://raffledraw-backendapi.onrender.com${draw.FilePath}`);
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
      const response = await fetch('https://raffledraw-backendapi.onrender.com/winners/add-winners', {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full p-6 bg-gradient-to-br from-yellow-500 to-indigo-600 min-h-screen text-white"
    >
      <motion.div 
        className="mb-6 p-4 bg-white bg-opacity-20 rounded-lg shadow-lg backdrop-blur-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-4">{draw.DrawName}</h2>
        <p><strong>Spin Time:</strong> {draw.SpinTime}</p>
        <p><strong>Draw Type:</strong> {draw.DrawType}</p>
        <p><strong>Coverage:</strong> {draw.DrawCoverage}</p>
        <p><strong>Region:</strong> {draw.RCName}</p>
        <p><strong>Setting:</strong> {draw.DrawSetting}</p>
        <p><strong>Prize:</strong> {draw.priceSelection}</p>
        <p><strong>Status:</strong> {draw.status}</p>
      </motion.div>

      <motion.h2 
        className="text-4xl font-bold mb-6 text-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        Winners Announcement
      </motion.h2>

      <AnimatePresence>
        {!isRaffleComplete && (
          <motion.div 
            className="text-center text-3xl font-bold mb-8"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Drawing winners...
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Winners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {winners.map((winner, idx) => (
            <motion.div
              key={idx}
              className="bg-white bg-opacity-20 p-4 rounded-lg shadow-lg backdrop-blur-md"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: idx * 0.1 }}
            >
              <p className="text-xl mb-2">{winner}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddWinner(winner)}
                className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
              >
                Add Winner
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-4">Saved Winners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedWinners.map((savedWinner, idx) => (
            <motion.div
              key={idx}
              className="bg-white bg-opacity-20 p-4 rounded-lg shadow-lg backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <p className="text-xl">{savedWinner}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-lg font-semibold mb-2">Uploaded CSV File</h3>
        <p>{draw.FilePath.split('/').pop()}</p>
      </motion.div>

      <motion.div 
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <h3 className="text-lg font-semibold mb-2">Rerun Draw</h3>
        <input
          type="number"
          value={remainingWinners}
          readOnly
          className="w-96 p-3 border rounded bg-white bg-opacity-20 mb-4"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRerunDraw}
          className="py-2 px-4 bg-yellow-500 ml-2 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Rerun Draw
        </motion.button>
      </motion.div>

      <motion.div 
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEndDraw}
          className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
        >
          Save Draw
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Winners;
