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
  const [remainingWinners, setRemainingWinners] = useState(draw.numberOfWinners);
  const [allNumbers, setAllNumbers] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [slotValues, setSlotValues] = useState(Array(draw.numberOfWinners).fill('-----'));
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchCsvFile = async () => {
      try {
        const response = await fetch(`https://raffledrawapi.onrender.com/${draw.FilePath}`);
        const csvFile = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          const csvData = reader.result;
          const parsedData = Papa.parse(csvData, { header: true });
          const msisdnData = [...new Set(parsedData.data.map(row => row.Msisdn).filter(Boolean))];
          setAllNumbers(msisdnData);
          setSlotValues(Array(draw.numberOfWinners).fill('-----'));
        };
        reader.readAsText(csvFile);
      } catch (error) {
        console.error('Error fetching CSV file:', error);
      }
    };

    fetchCsvFile();
  }, [draw.FilePath, draw.numberOfWinners]);

  useEffect(() => {
    if (isDrawing) {
      const interval = setInterval(() => {
        setSlotValues(shuffleArray(allNumbers).slice(0, remainingWinners));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isDrawing, allNumbers, remainingWinners]);

  const handleStartDraw = () => {
    setIsDrawing(true);
    setAnimationKey(prevKey => prevKey + 1);
    setTimeout(() => {
      setIsDrawing(false);
      pickWinners();
    }, 5000);
  };

  const pickWinners = () => {
    const newWinners = shuffleArray(allNumbers).slice(0, remainingWinners);
    setWinners(newWinners);
    setSlotValues(newWinners);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAddWinner = (msisdn) => {
    if (savedWinners.length < draw.numberOfWinners) {
      setSavedWinners([...savedWinners, msisdn]);
      setWinners(winners.filter(winner => winner !== msisdn));
      setRemainingWinners(remainingWinners - 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRerunDraw = () => {
    setIsDrawing(true);
    setAnimationKey(prevKey => prevKey + 1);
    setTimeout(() => {
      setIsDrawing(false);
      pickWinners();
    }, 5000);
  };

  const handleEndDraw = async () => {
    const payload = savedWinners.map(msisdn => ({ msisdn, drawId: draw.id }));

    try {
      const response = await fetch('https://raffledrawapi.onrender.com/winners/add-winners', {
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
      className="w-full p-6 bg-yellow-400 min-h-screen text-white"
    >
      <Toaster />
      
      <motion.h2 
        className="text-4xl font-bold mb-6 text-center text-black"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {draw.DrawName} - Winners Draw
      </motion.h2>

      <motion.div 
        className="mb-8 p-6 bg-white bg-opacity-20 rounded-lg shadow-lg backdrop-blur-md"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-center space-x-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={animationKey}
              className="flex justify-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {slotValues.slice(0, remainingWinners).map((value, index) => (
                <motion.div
                  key={index}
                  className="w-40 h-48 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden"
                  initial={{ rotateX: 180 }}
                  animate={{ rotateX: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <motion.div
                    className="text-xl font-bold"
                    animate={{ y: isDrawing ? [0, -20, 0] : 0 }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                  >
                    {value}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        {remainingWinners > 0 && (
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartDraw}
              disabled={isDrawing}
              className="py-2 px-4 bg-gray-800 text-white rounded hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
            >
              {isDrawing ? 'Drawing...' : 'Start Draw'}
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-black">Winners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {winners.map((winner, idx) => (
            <motion.div
              key={idx}
              className="bg-white bg-opacity-20 p-4 rounded-lg shadow-lg backdrop-blur-md"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: idx * 0.1 }}
            >
              <p className="text-xl mb-2 text-black">{winner}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAddWinner(winner)}
                className="py-1 px-3 bg-gray-800 text-white rounded hover:bg-green-600 transition-colors duration-200"
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
        transition={{ delay: 0.9 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-black">Saved Winners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedWinners.map((savedWinner, idx) => (
            <motion.div
              key={idx}
              className="bg-white bg-opacity-20 p-4 rounded-lg shadow-lg backdrop-blur-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <p className="text-xl text-black">{savedWinner}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="mt-6 flex justify-center space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        {remainingWinners > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRerunDraw}
            disabled={isDrawing}
            className="py-2 px-4 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-50"
          >
            Rerun Draw
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEndDraw}
          className="py-2 px-4 bg-red-500 text-black rounded hover:bg-red-600 transition-colors duration-200"
        >
          End Draw
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Winners;