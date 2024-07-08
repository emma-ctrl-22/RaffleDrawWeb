import React, { useState } from 'react';
import MoMo from '../assets/Momo.png';
import { prizesData } from '../assets/prizesData';
import { getPrizesByDrawType } from '../utils/getPrizesByDraw';
import regions from '../assets/regionsData.json';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {toast} from 'react-hot-toast'


const Raffles = () => {
  const [selectedRegionButton, setSelectedRegionButton] = useState('National');
  const [selectedDrawButton, setSelectedDrawButton] = useState('Single');
  const [numberOfDraws, setNumberOfDraws] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [spinTime, setSpinTime] = useState('');
  const [selectedDrawType, setSelectedDrawType] = useState('Weekly');
  const [drawName ,setDrawName] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedArea, setSelectedArea] = useState('');

  const allCounties = Object.values(regions).flat();

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

  const prizeOptions = getPrizesByDrawType(selectedDrawType, prizesData);

  const prizeInputs = Array.from({ length: numberOfDraws }, (_, index) => (
    <select
      key={index}
      className="w-96 p-3 border rounded bg-slate-300 mb-6"
    >
      <option value="" disabled>Select a prize</option>
      {prizeOptions.map((prize, idx) => (
        <option key={idx} value={prize.prize}>{prize.prize}</option>
      ))}
    </select>
  ));
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  console.log(window.electron);

  const saveDrawToDatabase = async (drawData) => {
    try {
    //   const response = await window.electron.saveDraw(drawData);
    //   console.log("Draw saved successfully:", response);
    //   toast.success('Draw saved successfully!');
    //   setNumberOfDraws(1);
    //   setSelectedRegion('');
    //   setSelectedCounty('');
    //   setSelectedArea('');
    //   setDrawName('');
    //   setSelectedFile(null);
    //   setSpinTime('');
    } catch (error) {
      console.error("Error saving draw:", error);
      toast.error('Error saving draw.');
    }
  };
  // Call this function with the draw data when the user saves a draw
  const handleSaveDraw = async () => {
    let csvFileName = '';
    if (selectedFile) {
      try {
        const result = await window.electron.uploadCSV(selectedFile.path);
        csvFileName = result.fileName;
        console.log(csvFileName);
      } catch (error) {
        console.error("Error uploading CSV:", error);
        toast.error('Error uploading CSV file.');
        return;
      }
    }
  
    const drawData = {
      drawName,
      drawSettings: selectedDrawType,
      drawCoverage: selectedRegionButton,
      drawType: selectedDrawButton,
      spinTime,
      numberOfDraws,
      prizes: prizeOptions,
      winners: [],
      status: 'not started',
      isPushedToOnlineDB: false,
      selectedArea: selectedArea,
      csvFileName: csvFileName
    };
  
    console.log(drawData);
    
    saveDrawToDatabase(drawData);
    setNumberOfDraws(1);
      setSelectedRegion('');
      setSelectedCounty('');
      setSelectedArea('');
      setDrawName('');
      setSelectedFile(null);
      setSpinTime('');
  };
  
  return (
    <div className="overflow-y-auto scrollbar-thin">
      <div className="w-full flex flex-row justify-between h-14 mb-6">
        <h2 className="text-2xl font-bold text-black ml-4">Create a new draw</h2>
        <img src={MoMo} alt="Logo 1" className="h-14" />
      </div>

      <div className="m-6">
        <h3 className="text-lg font-semibold mb-4">Draw settings</h3>
        <div className="space-y-4">
          <label className="flex items-center p-3 border rounded cursor-pointer">
            <input
              type="radio"
              name="draw-settings"
              className="form-radio text-indigo-600"
              value="Weekly"
              checked={selectedDrawType === 'Weekly'}
              onChange={handleDrawTypeChange}
            />
            <span className="ml-2">Weekly</span>
          </label>
          <label className="flex items-center p-3 border rounded cursor-pointer">
            <input
              type="radio"
              name="draw-settings"
              className="form-radio text-indigo-600"
              value="Monthly"
              checked={selectedDrawType === 'Monthly'}
              onChange={handleDrawTypeChange}
            />
            <span className="ml-2">Monthly</span>
          </label>
          <label className="flex items-center p-3 border rounded cursor-pointer">
            <input
              type="radio"
              name="draw-settings"
              className="form-radio text-indigo-600"
              value="Grand prize"
              checked={selectedDrawType === 'Grand prize'}
              onChange={handleDrawTypeChange}
            />
            <span className="ml-2">Grand prize</span>
          </label>
        </div>
      </div>

      <div className="m-6">
        <div className="flex space-x-6 w-96">
          <button
            className={`py-2 px-4 border rounded w-1/3 text-center ${selectedRegionButton === 'National' ? 'bg-yellow-400 font-bold' : ''}`}
            onClick={() => handleRegionButtonClick('National')}
          >
            National
          </button>
          <button
            className={`py-2 px-4 border rounded w-1/3 text-center ${selectedRegionButton === 'County' ? 'bg-yellow-400 font-bold' : ''}`}
            onClick={() => handleRegionButtonClick('County')}
          >
            County
          </button>
          <button
            className={`py-2 px-4 border rounded w-1/3 text-center ${selectedRegionButton === 'Region' ? 'bg-yellow-400 font-bold' : ''}`}
            onClick={() => handleRegionButtonClick('Region')}
          >
            Region
          </button>
        </div>
      </div>

      <div className='m-6 flex flex-col'>
        {selectedRegionButton === 'National' ? null : (
          <>
            {selectedRegionButton === 'Region' ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Select Region</h3>
                <select
                  className="w-96 p-3 border rounded bg-slate-300"
                  value={selectedRegion}
                  onChange={(e) => {setSelectedRegion(e.target.value);setSelectedArea(e.target.value);}}
                >
                  <option value="" disabled>Select a region</option>
                  {Object.keys(regions).map((region, idx) => (
                    <option key={idx} value={region}>{region}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Select County</h3>
                <select
                  className="w-96 p-3 border rounded bg-slate-300"
                  value={selectedCounty}
                  onChange={(e) => {setSelectedCounty(e.target.value);setSelectedArea(e.target.value);}}
                >
                  <option value="" disabled>Select a county</option>
                  {allCounties.map((county, idx) => (
                    <option key={idx} value={county}>{county}</option>
                  ))}
                </select>
              </>
            )}
          </>
        )}
      </div>
      <div className='ml-6'>
        <input value={drawName} className="w-96 p-3 border rounded bg-slate-300" onChange={(e)=>setDrawName(e.target.value)} type="text" placeholder='Enter Draw Name '/> 
      </div>


      <div className="m-6 flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Draws</h3>
        <div className="flex space-x-6 w-96">
          <button
            className={`py-2 px-4 border rounded w-1/3 text-center ${selectedDrawButton === 'Single' ? 'bg-yellow-400 font-bold' : ''}`}
            onClick={() => handleDrawButtonClick('Single')}
          >
            Single
          </button>
          <button
            className={`py-2 px-4 border rounded w-1/3 text-center ${selectedDrawButton === 'Multiple' ? 'bg-yellow-400 font-bold' : ''}`}
            onClick={() => handleDrawButtonClick('Multiple')}
          >
            Multiple
          </button>
        </div>
        {selectedDrawButton === 'Multiple' && (
          <>
          <h2 className="text-lg font-semibold mt-4">Number of Winners</h2>
          <select
          className="w-96 p-3 border rounded bg-slate-300 mt-2"
          value={numberOfDraws}
          onChange={(e) => setNumberOfDraws(e.target.value)}
        >
          <option value="" disabled>Select Number of Draws</option>
          <option value={1}>1 </option>
          <option value={2}>2 </option>
          <option value={3}>3 </option>
          <option value={4}>4 </option>
          <option value={5}>5 </option>
          <option value={6}>6 </option>
          <option value={7}>7 </option>
          <option value={8}>8 </option>
          <option value={9}>9 </option>
          <option value={10}>10 </option>
        </select>
          </>
        )}
         <div className=" flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Spin Time</h3>
        <select
          className="w-96 p-3 border rounded bg-slate-300"
          value={spinTime}
          onChange={(e) => setSpinTime(e.target.value)}
        >
          <option value="" disabled>Select spin time</option>
          <option value="1">1 minute</option>
          <option value="2">2 minutes</option>
          <option value="5">5 minutes</option>
        </select>
      </div>
      </div>

      <div className="m-6 flex flex-col">
        <h3 className="text-lg font-semibold mb-4">Prize Selection</h3>
        {prizeInputs}
      </div>
      <div className="m-6">
        <h3 className="text-lg font-semibold mb-4">Upload data</h3>
        <div className="flex items-center space-x-4 border rounded p-3 bg-white">
          <button className="bg-yellow-500 text-black py-2 px-4 rounded" onClick={handleOpen}>Upload from...</button>
        </div>
      </div>

      <div className="m-6">
        <button className="w-80 py-2 border rounded bg-slate-300 text-center">Preview</button>
      </div>

      <div className="m-6 flex flex-row space-x-8">
        <button className="w-80 py-2 border rounded bg-yellow-400 text-center text-black" onClick={handleSaveDraw}>Save Draw</button>
        
        <button className="w-80 py-2 border rounded bg-yellow-400 text-center text-black">Start Draw</button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Items</DialogTitle>
        <DialogContent>
          <div className="flex justify-around mt-4 w-98 h-36">
            <IconButton className='flex flex-col' component="label">
              <ComputerIcon style={{ fontSize: 40 }} />
              <input type="file" hidden onChange={handleFileSelect} accept=".csv" />
              <p>Upload from pc </p>
            </IconButton>
            <IconButton className='flex flex-col'>
              <CloudUploadIcon style={{ fontSize: 40 }} />
              <p>Upload from Server </p>
            </IconButton>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Raffles;
