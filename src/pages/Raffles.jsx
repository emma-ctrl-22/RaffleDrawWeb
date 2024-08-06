import React, { useState, useEffect } from 'react';
import MoMo from '../assets/Momo.png';
import regionsData from '../assets/regionsData.json';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Raffles = () => {
  const [selectedRegionButton, setSelectedRegionButton] = useState('National');
  const [selectedDrawButton, setSelectedDrawButton] = useState('Single');
  const [numberOfDraws, setNumberOfDraws] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [spinTime, setSpinTime] = useState('');
  const [selectedDrawType, setSelectedDrawType] = useState('Weekly');
  const [drawName, setDrawName] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [prizesData, setPrizesData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedPrizeId, setSelectedPrizeId] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUserId(user.id);
    }
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const response = await axios.get('https://raffledraw-backendapi.onrender.com/prizes/get-all');
        setPrizesData(response.data);
      } catch (error) {
        console.error('Error fetching prizes:', error);
        toast.error('Failed to fetch prizes');
      }
    };
    fetchPrizes();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRegionButtonClick = (buttonName) => {
    setSelectedRegionButton(buttonName);
    setSelectedRegion('');
    setSelectedCounty('');
    setSelectedArea('');
  };

  const handleDrawButtonClick = (buttonName) => {
    setSelectedDrawButton(buttonName);
    if (buttonName === 'Single') {
      setNumberOfDraws(1);
    }
  };

  const handleNumberOfDrawsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setNumberOfDraws(value);
    }
  };

  const handleDrawTypeChange = (e) => {
    setSelectedDrawType(e.target.value);
  };

  const prizeOptions = prizesData.filter(prize => prize.Type === selectedDrawType);

  const handlePrizeChange = (e) => {
    setSelectedPrizeId(e.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveDrawToDatabase = async (drawData) => {
    try {
      const response = await axios.post('https://raffledraw-backendapi.onrender.com/draws/create', drawData);
      toast.success('Draw saved successfully!');
      // Reset form fields
      setNumberOfDraws(1);
      setSelectedRegion('');
      setSelectedCounty('');
      setSelectedArea('');
      setDrawName('');
      setSelectedFile(null);
      setSpinTime('');
    } catch (error) {
      console.error("Error saving draw:", error);
      toast.error('Error saving draw.');
    }
  };

  const handleSaveDraw = async () => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    let filePath = '';
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      try {
        const response = await axios.post('https://raffledraw-backendapi.onrender.com/draws/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        filePath = response.data.filePath;
        console.log('File uploaded successfully:', filePath);
      } catch (error) {
        console.error("Error uploading CSV:", error);
        toast.error('Error uploading CSV file.');
        return;
      }
    }
  
    const drawData = {
      DrawName: drawName,
      DrawSetting: selectedRegionButton,
      DrawCoverage: selectedDrawType ,
      DrawType: selectedDrawButton,
      SpinTime: spinTime,
      numberOfWinners: numberOfDraws,
      RCName: selectedArea,
      priceSelection: selectedPrizeId,
      author: userId,
      FilePath: filePath
    };
  console.log('Draw data:', drawData);
    try {
      const response = await axios.post('https://raffledraw-backendapi.onrender.com/draws/create', drawData);
      toast.success('Draw saved successfully!');
      // Reset form fields
      setNumberOfDraws(1);
      setSelectedRegion('');
      setSelectedCounty('');
      setSelectedArea('');
      setDrawName('');
      setSelectedFile(null);
      setSpinTime('');
    } catch (error) {
      console.error("Error saving draw:", error);
      toast.error('Error saving draw.');
    }
  };

  const handleStartDraw = async () => {
    if (!selectedFile) {
      toast.error('Please upload a CSV file.');
      return;
    }

    try {
      // Implement your getRandomWinners function
      const winners = await getRandomWinners(selectedFile, numberOfDraws);
      navigate('/winners', { state: { winners, csvFile: selectedFile } });
    } catch (error) {
      console.error('Error getting random winners:', error);
      toast.error('Error getting random winners.');
    }
  };

  return (
    <div className="overflow-y-auto scrollbar-thin">
      <div className="w-full flex flex-row justify-between h-14 mb-6">
        <h2 className="text-2xl font-bold text-black ml-4">Create a new draw</h2>
        <img src={MoMo} alt="Logo 1" className="h-14" />
      </div>

      {/* Draw settings */}
      <div className="m-6">
        <h3 className="text-lg font-semibold mb-4">Draw settings</h3>
        <div className="space-y-4">
          {['Weekly', 'Monthly', 'Grand'].map((type) => (
            <label key={type} className="flex items-center p-3 border rounded cursor-pointer">
              <input
                type="radio"
                name="draw-settings"
                className="form-radio text-indigo-600"
                value={type}
                checked={selectedDrawType === type}
                onChange={handleDrawTypeChange}
              />
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Region selection */}
      <div className="m-6">
        <div className="flex space-x-6 w-96">
          {['National', 'County', 'Region'].map((region) => (
            <button
              key={region}
              className={`py-2 px-4 border rounded w-1/3 text-center ${selectedRegionButton === region ? 'bg-yellow-400 font-bold' : ''}`}
              onClick={() => handleRegionButtonClick(region)}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Region/County selection */}
      <div className='m-6 flex flex-col'>
        {selectedRegionButton !== 'National' && (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Select {selectedRegionButton === 'Region' ? 'Region' : 'County'}
            </h3>
            <select
              className="w-96 p-3 border rounded bg-slate-300"
              value={selectedRegionButton === 'Region' ? selectedRegion : selectedCounty}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedRegionButton === 'Region') {
                  setSelectedRegion(selectedValue);
                } else {
                  setSelectedCounty(selectedValue);
                }
                setSelectedArea(selectedValue);
              }}
            >
              <option value="" disabled>Select a {selectedRegionButton === 'Region' ? 'region' : 'county'}</option>
              {selectedRegionButton === 'Region'
                ? Object.keys(regionsData).map((region, index) => (
                  <option key={index} value={region}>{region}</option>
                ))
                : Object.values(regionsData).flat().map((county, index) => (
                  <option key={index} value={county}>{county}</option>
                ))
              }
            </select>
          </>
        )}
      </div>

      {/* Draw type */}
      <div className="m-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Draw type</h3>
          <div className="flex space-x-6 w-96">
            {['Single', 'Multiple'].map((type) => (
              <button
                key={type}
                className={`py-2 px-4 border rounded w-1/2 text-center ${selectedDrawButton === type ? 'bg-yellow-400 font-bold' : ''}`}
                onClick={() => handleDrawButtonClick(type)}
              >
                {type}
              </button>
            ))}
          </div>
          {selectedDrawButton === 'Multiple' && (
            <>
              <label className="text-lg font-semibold">Number of Draws</label>
              <input
                type="number"
                className="w-96 p-3 border rounded bg-slate-300"
                value={numberOfDraws}
                onChange={handleNumberOfDrawsChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Spin time */}
      <div className="m-6">
        <h3 className="text-lg font-semibold mb-4">Spin time</h3>
        <input
          type="text"
          placeholder="Enter spin time"
          className="w-96 p-3 border rounded bg-slate-300"
          value={spinTime}
          onChange={(e) => setSpinTime(e.target.value)}
        />
      </div>

      {/* Draw name */}
      <div className="m-6">
        <h3 className="text-lg font-semibold mb-4">Draw name</h3>
        <input
          type="text"
          placeholder="Enter draw name"
          className="w-96 p-3 border rounded bg-slate-300"
          value={drawName}
          onChange={(e) => setDrawName(e.target.value)}
        />
      </div>

      {/* Prize selection */}
      <div className="m-6">
        <h3 className="text-lg font-semibold mb-4">Select prize for the draw</h3>
        <select
          className="w-96 p-3 border rounded bg-slate-300 mb-6"
          value={selectedPrizeId}
          onChange={handlePrizeChange}
        >
          <option value="" disabled>Select a prize</option>
          {prizeOptions.map((prize) => (
            <option key={prize.id} value={prize.id}>{prize.PrizeName}</option>
          ))}
        </select>
      </div>

      {/* File upload */}
      <div className="m-6">
        <h3 className="text-lg font-semibold mb-4">Upload CSV File</h3>
        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
          Upload CSV
          <input type="file" accept=".csv" hidden onChange={handleFileSelect} />
        </Button>
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center mt-8 space-x-6">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveDraw}
          startIcon={<ComputerIcon />}
        >
          Save Draw
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleStartDraw}
          startIcon={<ComputerIcon />}
        >
          Start Draw
        </Button>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Save Draw</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to save this draw?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSaveDraw} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Raffles;