import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Report = () => {
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const response = await axios.get('https://raffledrawapi.onrender.com/draws/get-all');
        setDraws(response.data);
      } catch (error) {
        console.error('Error fetching draws:', error);
      }
    };

    fetchDraws();
  }, []);

  const handleRowClick = (draw) => {
    setSelectedDraw(draw);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDraw(null);
  };

  const downloadDrawPdf = (draw) => {
    const doc = new jsPDF();
    doc.text(`Draw Report: ${draw.DrawName}`, 14, 16);
    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['Name', draw.DrawName],
        ['Draw Type', draw.DrawType],
        ['Number of Winners', draw.numberOfWinners],
        ['Status', draw.status],
        ['Description', draw.description],
        ['Spin Time', draw.SpinTime],
        ['Draw Coverage', draw.DrawCoverage],
        ['RC Name', draw.RCName],
        ['Draw Setting', draw.DrawSetting],
        ['Price Selection', draw.priceSelection],
        ['Author', draw.Author.username],
        ['Created At', new Date(draw.createdAt).toLocaleString()],
        ['Updated At', new Date(draw.updatedAt).toLocaleString()],
      ],
    });
    doc.save(`${draw.DrawName}_report.pdf`);
  };

  return (
    <div className="p-4">
      <div className="font-bold pl-2 pt-4">Report</div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">ID</th>
            <th className="py-2">Draw Name</th>
            <th className="py-2">Draw Type</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {draws && draws.length > 0 ? (
            draws.map(draw => (
              <tr key={draw.id} className="cursor-pointer" onClick={() => handleRowClick(draw)}>
                <td className="py-2">{draw.id}</td>
                <td className="py-2">{draw.DrawName}</td>
                <td className="py-2">{draw.DrawType}</td>
                <td className="py-2">{draw.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-2 text-center">No draws available</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && selectedDraw && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Draw Information</h3>
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <strong>Spin Time:</strong> {selectedDraw.SpinTime} minutes
              </div>
              <div>
                <strong>Draw Coverage:</strong> {selectedDraw.DrawCoverage}
              </div>
              <div>
                <strong>RC Name:</strong> {selectedDraw.RCName}
              </div>
              <div>
                <strong>Draw Setting:</strong> {selectedDraw.DrawSetting}
              </div>
              <div>
                <strong>Price Selection:</strong> {selectedDraw.priceSelection}
              </div>
              <div>
                <strong>Author:</strong> {selectedDraw.Author.username}
              </div>
              <div>
                <strong>Created At:</strong> {new Date(selectedDraw.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Updated At:</strong> {new Date(selectedDraw.updatedAt).toLocaleString()}
              </div>
            </div>
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => downloadDrawPdf(selectedDraw)}
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
