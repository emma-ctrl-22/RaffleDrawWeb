import React, { useState, useEffect } from 'react';
import UpcomingRaffle from '../assets/UpcominRaffles.json'
const UpcomingRaffles = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    startDate: '',
    winners: '',
  });
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [draws, setDraws] = useState([]);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const fetchedDraws = await window.electron.fetchDraws();
        setDraws(UpcomingRaffle);
        console.log('Fetched Draws:', fetchedDraws);
      } catch (error) {
        console.error('Error fetching draws:', error);
      }
    };
    fetchDraws();
  }, []);

  const handleToggleAction = (index) => {
    const updatedDraws = [...draws];
    const currentAction = updatedDraws[index].status;

    if (currentAction === 'not started') {
      updatedDraws[index].status = 'ongoing';
    } else if (currentAction === 'ongoing') {
      updatedDraws[index].status = 'not started';
    }

    setDraws(updatedDraws);
  };

  const handleDeleteRaffle = async (index) => {
    try {
      await window.electron.deleteDraw(draws[index].id);
      const updatedDraws = draws.filter((_, i) => i !== index);
      setDraws(updatedDraws);
    } catch (error) {
      console.error('Error deleting draw:', error);
    }
  };

  const handleEditButtonClick = (index) => {
    setCurrentEditIndex(index);
    setEditFormData({
      name: draws[index].drawName,
      startDate: draws[index].drawType,
      winners: draws[index].winners,
    });
    setIsEditing(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const updatedDraw = {
        ...draws[currentEditIndex],
        drawName: editFormData.name,
        drawType: editFormData.startDate,
        winners: editFormData.winners,
      };
      await window.electron.editDraw(updatedDraw);
      const updatedDraws = [...draws];
      updatedDraws[currentEditIndex] = updatedDraw;
      setDraws(updatedDraws);
      setIsEditing(false);
      setCurrentEditIndex(null);
    } catch (error) {
      console.error('Error saving draw:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentEditIndex(null);
  };

  return (
    <div className="m-8">
      <h2 className="text-xl font-bold mb-4">Upcoming Raffles</h2>
      {isEditing && (
        <div className="mb-4 p-4 bg-gray-100 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Edit Raffle</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="text"
                name="startDate"
                value={editFormData.startDate}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Winners</label>
              <input
                type="text"
                name="winners"
                value={editFormData.winners}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="mt-4 space-x-2">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleSaveEdit}
            >
              Save
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="text-left">
          <tr>
            <th className="py-2 pl-4 border-b">Name</th>
            <th className="py-2 border-b">Draw Type</th>
            <th className="py-2 border-b">Winners</th>
            <th className="py-2 border-b">Actions</th>
            <th className="py-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {draws.map((draw, index) => (
            <tr key={draw.id}>
              <td className="py-2 px-4 border-b">{draw.drawName}</td>
              <td className="py-2 px-4 border-b">{draw.drawType}</td>
              <td className="py-2 px-4 border-b">
                <small className="bg-yellow-500 text-black py-1 px-2 rounded">
                {Array.isArray(draw.winners) && draw.winners.length === 0 ? `0/${draw.numberOfDraws}` : `${draw.winners.length}/${draw.numberOfDraws}`}
                </small>
              </td>
              <td className="py-2 px-4 border-b">
                {draw.status === 'not started' ? (
                  <button
                    className="bg-green-500 text-white py-1 px-3 rounded"
                    onClick={() => handleToggleAction(index)}
                  >
                    Start
                  </button>
                ) : (
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded"
                    onClick={() => handleToggleAction(index)}
                  >
                    Ongoing
                  </button>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-gray-500 text-white py-1 px-3 rounded"
                  onClick={() => handleDeleteRaffle(index)}
                >
                  Delete
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded"
                  onClick={() => handleEditButtonClick(index)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingRaffles;
