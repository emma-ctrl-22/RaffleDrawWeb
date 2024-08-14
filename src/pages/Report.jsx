import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const SearchIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-5 h-5 ${className}`}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
};



const Report = () => {
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredDraws = draws.filter((draw) => {
    const drawDate = new Date(draw.createdAt);
    const matchesSearch = draw.DrawName.toLowerCase().includes(
      searchQuery.toLowerCase()
    );
    const matchesDateRange =
      (!startDate || drawDate >= new Date(startDate)) &&
      (!endDate || drawDate <= new Date(endDate));
    return matchesSearch && matchesDateRange;
  });

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        const response = await axios.get(
          "https://raffledrawapi.onrender.com/draws/get-all"
        );
        setDraws(response.data);
      } catch (error) {
        console.error("Error fetching draws:", error);
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
      head: [["Field", "Value"]],
      body: [
        ["Name", draw.DrawName],
        ["Draw Type", draw.DrawType],
        ["Number of Winners", draw.numberOfWinners],
        ["Status", draw.status],
        ["Description", draw.description],
        ["Spin Time", draw.SpinTime],
        ["Draw Coverage", draw.DrawCoverage],
        ["RC Name", draw.RCName],
        ["Draw Setting", draw.DrawSetting],
        ["Price Selection", draw.priceSelection],
        ["Author", draw.Author.username],
        ["Created At", new Date(draw.createdAt).toLocaleString()],
        ["Updated At", new Date(draw.updatedAt).toLocaleString()],
      ],
    });
    doc.save(`${draw.DrawName}_report.pdf`);
  };

  return (
    <div className="p-4">
      <div className="pt-4 pl-2 mb-4 font-bold">Report</div>
      <div className="mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="search"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Search Draws
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Enter Draw Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="text-gray-400" />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              End Date
            </label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <table className="min-w-full bg-white border border-collapse border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-200">ID</th>
            <th className="px-4 py-2 border border-gray-200">Draw Name</th>
            <th className="px-4 py-2 border border-gray-200">Draw Type</th>
            <th className="px-4 py-2 border border-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredDraws && filteredDraws.length > 0 ? (
            filteredDraws.map((draw) => (
              <tr
                key={draw.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(draw)}
              >
                <td className="px-4 py-2 border border-gray-200">{draw.id}</td>
                <td className="px-4 py-2 border border-gray-200">
                  {draw.DrawName}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {draw.DrawType}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {draw.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-4 py-2 text-center border border-gray-200"
              >
                No draws available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && selectedDraw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-1/3 p-8 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-lg font-bold">Draw Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong> {selectedDraw.DrawName}
              </div>
              <div>
                <strong>Draw Type:</strong> {selectedDraw.DrawType}
              </div>
              <div>
                <strong>Number of Winners:</strong>{" "}
                {selectedDraw.numberOfWinners}
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
                <strong>Created At:</strong>{" "}
                {new Date(selectedDraw.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {new Date(selectedDraw.updatedAt).toLocaleString()}
              </div>
            </div>
            <button
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
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
