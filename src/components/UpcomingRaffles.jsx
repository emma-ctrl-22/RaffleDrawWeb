import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UpcomingRaffles = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    drawType: '',
    winners: '',
  });
  const [draws, setDraws] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user')).id;
        const response = await fetch(`https://raffledrawapi.onrender.com/draws/get-by-author/${userId}`);
        const data = await response.json();

        // Log the response to see what you are receiving
        console.log('API response:', data);

        // Check if data is an array or an object
        let drawsArray = [];
        if (Array.isArray(data)) {
          drawsArray = data;
        } else if (data && typeof data === 'object') {
          drawsArray = [data];
        } else {
          console.error('Unexpected response format:', data);
        }

        const pendingDraws = drawsArray.filter(draw => draw.status === 'Pending');
        console.log('Pending draws:', pendingDraws);
        setDraws(pendingDraws);

      } catch (error) {
        console.error('Error fetching draws:', error);
      }
    };

    fetchDraws();
  }, []);

  const handleToggleAction = async (index) => {
    const draw = draws[index];
    if (draw.status === 'Pending') {
      navigate('/winners', { state: { draw } });
    } else {
      const updatedDraws = [...draws];
      const currentAction = updatedDraws[index].status;

      if (currentAction === 'not started') {
        updatedDraws[index].status = 'ongoing';
      } else if (currentAction === 'ongoing') {
        updatedDraws[index].status = 'not started';
      }

      setDraws(updatedDraws);

      try {
        await fetch(`https://raffledrawapi.onrender.com/draws/${updatedDraws[index].id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: updatedDraws[index].status }),
        });
      } catch (error) {
        console.error('Error updating draw status:', error);
      }
    }
  };

  const handleDeleteRaffle = async (index) => {
    try {
      await fetch(`https://raffledrawapi.onrender.com/draws/${draws[index].id}`, {
        method: 'DELETE',
      });
      const updatedDraws = draws.filter((_, i) => i !== index);
      setDraws(updatedDraws);
    } catch (error) {
      console.error('Error deleting draw:', error);
    }
  };

  const handleEditButtonClick = (index) => {
    setCurrentEditIndex(index);
    setEditFormData({
      name: draws[index].DrawName,
      drawType: draws[index].DrawType,
      winners: draws[index].numberOfWinners,
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
        DrawName: editFormData.name,
        DrawType: editFormData.drawType,
        numberOfWinners: editFormData.winners,
      };

      await fetch(`https://raffledrawapi.onrender.com/draws/edit-draw/${updatedDraw.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDraw),
      });

      const updatedDraws = [...draws];
      updatedDraws[currentEditIndex] = updatedDraw;
      setDraws(updatedDraws);
      console.log('Draw updated:', updatedDraw);
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

  const handleShowModal = (draw) => {
    setSelectedDraw(draw);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDraw(null);
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
              <label className="block text-sm font-medium">Draw Type</label>
              <input
                type="text"
                name="drawType"
                value={editFormData.drawType}
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
            <tr key={draw.id} onClick={() => handleShowModal(draw)}>
              <td className="py-2 px-4 border-b">{draw.DrawName}</td>
              <td className="py-2 px-4 border-b">{draw.DrawType}</td>
              <td className="py-2 px-4 border-b">
                <small className="bg-yellow-500 text-black py-1 px-2 rounded">
                  {draw.numberOfWinners}
                </small>
              </td>
              <td className="py-2 px-4 border-b">
                {draw.status === 'Pending' ? (
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
      
      {showModal && selectedDraw && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Draw Information</h3>
            <div className="space-y-2">
              <div>
                <strong>Name:</strong> {selectedDraw.DrawName}
              </div>
              <div>
                <strong>Draw Type:</strong> {selectedDraw.DrawType}
              </div>
              <div>
                <strong>Number of Winners:</strong> {selectedDraw.numberOfWinners}
              </div>
              <div>
                <strong>Status:</strong> {selectedDraw.status}
              </div>
              <div>
                <strong>Description:</strong> {selectedDraw.description}
              </div>
              {/* Add more fields as needed */}
            </div>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingRaffles;
