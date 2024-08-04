import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Momo from '../assets/Momo.png';

const Prizes = () => {
  const [grand, setGrand] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const [newPrize, setNewPrize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedPrizeType, setSelectedPrizeType] = useState('grand');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchPrizes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/prizes/get-all');
      const prizes = response.data;
      setGrand(prizes.filter(prize => prize.Type === 'Grand'));
      setWeekly(prizes.filter(prize => prize.Type === 'Weekly'));
      setMonthly(prizes.filter(prize => prize.Type === 'Monthly'));
    } catch (error) {
      console.error('Error fetching prizes:', error);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const handleAddPrize = async () => {
    if (newPrize && quantity > 0) {
      const newPrizeObj = { PrizeName: newPrize, Quantity: quantity, Type: selectedPrizeType.charAt(0).toUpperCase() + selectedPrizeType.slice(1) };
      try {
        if (isEditing) {
          await axios.put(`http://localhost:3000/prizes/update/${editId}`, newPrizeObj);
        } else {
          await axios.post('http://localhost:3000/prizes/create', newPrizeObj);
        }
        fetchPrizes();
        setNewPrize('');
        setQuantity(1);
        setIsEditing(false);
        setEditIndex(null);
        setEditId(null);
      } catch (error) {
        console.error('Error adding/updating prize:', error);
      }
    }
  };

  const handleDeletePrize = async (id, type) => {
    try {
      await axios.delete(`/prizes/delete/${id}`);
      fetchPrizes();
    } catch (error) {
      console.error('Error deleting prize:', error);
    }
  };

  const handleEditPrize = (prize, index, type) => {
    setNewPrize(prize.PrizeName);
    setQuantity(prize.Quantity);
    setSelectedPrizeType(type);
    setIsEditing(true);
    setEditIndex(index);
    setEditId(prize.id);
  };

  const renderPrizes = (prizes, type) => (
    <div className="m-8 relative z-60">
      <h2 className="font-bold text-xl mb-4">{type.charAt(0).toUpperCase() + type.slice(1)} Prizes</h2>
      {prizes.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Prize</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((prize, index) => (
              <tr key={prize.id}>
                <td className="border p-2">{prize.PrizeName}</td>
                <td className="border p-2">{prize.Quantity}</td>
                <td className="border p-2">
                  <button
                    className="p-2 bg-blue-500 text-white rounded mr-2"
                    onClick={() => handleEditPrize(prize, index, type)}
                  >
                    Edit
                  </button>
                  <button
                    className="p-2 bg-red-500 text-white rounded"
                    onClick={() => handleDeletePrize(prize.id, type)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No prizes added.</p>
      )}
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
