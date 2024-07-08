import React, { useState, useEffect } from 'react';
import { prizesData } from '../assets/prizesData';
import Momo from '../assets/Momo.png';

const Prizes = () => {
  const { grand: initialGrand, weekly: initialWeekly, monthly: initialMonthly } = prizesData;

  const [grand, setGrand] = useState(initialGrand);
  const [weekly, setWeekly] = useState(initialWeekly);
  const [monthly, setMonthly] = useState(initialMonthly);

  const [newPrize, setNewPrize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedPrizeType, setSelectedPrizeType] = useState('grand');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState(null);

  const handleAddPrize = () => {
    if (newPrize && quantity > 0) {
      const newPrizeObj = { grade: "Other Prizes", prize: newPrize, quantity, draws: 1 };
      if (isEditing) {
        switch (editType) {
          case 'grand':
            const updatedGrand = [...grand];
            updatedGrand[editIndex] = newPrizeObj;
            setGrand(updatedGrand);
            break;
          case 'weekly':
            const updatedWeekly = [...weekly];
            updatedWeekly[editIndex] = newPrizeObj;
            setWeekly(updatedWeekly);
            break;
          case 'monthly':
            const updatedMonthly = [...monthly];
            updatedMonthly[editIndex] = newPrizeObj;
            setMonthly(updatedMonthly);
            break;
          default:
            break;
        }
        setIsEditing(false);
        setEditIndex(null);
        setEditType(null);
      } else {
        switch (selectedPrizeType) {
          case 'grand':
            setGrand([...grand, newPrizeObj]);
            break;
          case 'weekly':
            setWeekly([...weekly, newPrizeObj]);
            break;
          case 'monthly':
            setMonthly([...monthly, newPrizeObj]);
            break;
          default:
            break;
        }
      }
      setNewPrize('');
      setQuantity(1);
    }
  };

  const handleDeletePrize = (type, index) => {
    switch (type) {
      case 'grand':
        setGrand(grand.filter((_, i) => i !== index));
        break;
      case 'weekly':
        setWeekly(weekly.filter((_, i) => i !== index));
        break;
      case 'monthly':
        setMonthly(monthly.filter((_, i) => i !== index));
        break;
      default:
        break;
    }
  };

  const handleEditPrize = (type, index) => {
    let prizeToEdit;
    switch (type) {
      case 'grand':
        prizeToEdit = grand[index];
        break;
      case 'weekly':
        prizeToEdit = weekly[index];
        break;
      case 'monthly':
        prizeToEdit = monthly[index];
        break;
      default:
        break;
    }
    setNewPrize(prizeToEdit.prize);
    setQuantity(prizeToEdit.quantity);
    setSelectedPrizeType(type);
    setIsEditing(true);
    setEditIndex(index);
    setEditType(type);
  };

  useEffect(() => {
    prizesData.grand = grand;
    prizesData.weekly = weekly;
    prizesData.monthly = monthly;
  }, [grand, weekly, monthly]);

  const renderPrizes = (prizes, type) => (
    <div className="m-8 relative z-60">
      <h2 className="font-bold text-xl mb-4">{type.charAt(0).toUpperCase() + type.slice(1)} Prizes</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Grade</th>
            <th className="border p-2">Prize</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prizes.map((prize, index) => (
            <tr key={index}>
              <td className="border p-2">{prize.grade}</td>
              <td className="border p-2">{prize.prize}</td>
              <td className="border p-2">{prize.quantity}</td>
              <td className="border p-2">
                <button
                  className="p-2 bg-blue-500 text-white rounded mr-2"
                  onClick={() => handleEditPrize(type, index)}
                >
                  Edit
                </button>
                <button
                  className="p-2 bg-red-500 text-white rounded"
                  onClick={() => handleDeletePrize(type, index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="">
      <div className="w-full flex flex-row justify-between h-14 mb-6">
        <h2 className="text-2xl font-bold text-black ml-4">Prizes</h2>
        <img src={Momo} alt="Logo 1" className="h-14" />
      </div>

      <div className="m-6">
        <input
          type="text"
          className="p-2 border rounded mr-4"
          placeholder="Enter new prize"
          value={newPrize}
          onChange={(e) => setNewPrize(e.target.value)}
        />
        <input
          type="number"
          className="p-2 border rounded mr-4"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <select
          className="p-2 border rounded mr-4"
          value={selectedPrizeType}
          onChange={(e) => setSelectedPrizeType(e.target.value)}
        >
          <option value="grand">Grand Prize</option>
          <option value="weekly">Weekly Prize</option>
          <option value="monthly">Monthly Prize</option>
        </select>
        <button
          className="p-2 bg-yellow-400 text-black rounded"
          onClick={handleAddPrize}
        >
          {isEditing ? 'Update Prize' : 'Add Prize'}
        </button>
      </div>

      {renderPrizes(grand, 'grand')}
      {renderPrizes(weekly, 'weekly')}
      {renderPrizes(monthly, 'monthly')}
    </div>
  );
};

export default Prizes;
