import {useState,useEffect} from 'react'
import recentResults from '../assets/ResultsData.json'

const ResultsTable = () => {
  const [draws, setDraws] = useState([]);

  useEffect(() => {
    const fetchDraws = async () => {
      try {
        // Retrieve the user ID from local storage
        const userId = JSON.parse(localStorage.getItem('user')).id;

        // Fetch draws for the specific user
        const response = await fetch(`https://raffledrawapi.onrender.com/draws/get-by-author/${userId}`);
        const fetchedDraws = await response.json();

        // Filter draws with status "Pending"
        const pendingDraws = fetchedDraws.filter(draw => draw.status === 'Completed');
        
        setDraws(pendingDraws);
      } catch (error) {
        console.error('Error fetching draws:', error);
      }
    };

    fetchDraws();
  }, []);

  return (
    <div className='m-8'>
    <h2 className="text-xl font-bold mb-4">Recent results</h2>
    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
      <thead className="text-left">
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Draw type</th>
          <th className="py-2 px-4 border-b">Winners drawn</th>
        </tr>
      </thead>
      <tbody>
        {draws.map((result, index) => (
          <tr key={index}>
            <td className="py-2 px-4 border-b">{result.DrawName}</td>
            <td className="py-2 px-4 border-b">{result.DrawType}</td>
            <td className="py-2 px-4 border-b">
              <button className="bg-yellow-500 text-black py-1 px-3 rounded">{result.numberOfWinners}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default ResultsTable