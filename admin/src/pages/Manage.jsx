import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';

const Manage = () => {
  const [poojas, setPoojas] = useState([]); // Ensure it's an array initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoojas = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/pooja/all`);
        if (response.data.success && Array.isArray(response.data.poojas)) {
          setPoojas(response.data.poojas.reverse());
        } else {
          console.error("Invalid data format:", response.data);
          setPoojas([]); // Fallback to an empty array
        }
      } catch (err) {
        console.error("Error fetching poojas:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoojas();
  }, []);

  if (loading) return <p className="mt-10 text-lg">Loading poojas...</p>;
  if (error) return <p>Error loading poojas: {error}</p>;

  return (
    <div className='w-full py-6 bg-white font-primary font-medium'>
      <h2 className="text-lg sm:text-2xl mb-6">Manage Poojas</h2>
      {poojas.length === 0 ? (
        <p>No poojas found.</p>
      ) : (
        <div className="grid gap-4">
          {poojas.map((pooja) => (
            <div key={pooja._id} className="px-3 py-2 border flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center">
                <img src={pooja.image} alt={pooja.name} className="w-20 sm:w-30 h-20 sm:h-30 mr-4 object-cover" />
                <div>
                  <h3 className="text-lg font-semibold">{pooja.name}</h3>
                  <p className="text-gray-600">{pooja.description}</p>
                </div>
              </div>
              <div className='m-2'>
                <Link to={`/pooja-manage/update/${pooja._id}`} className="text-gray-600 mr-6 hover:text-orange-600">Update</Link>
                <Link to={`/pooja-manage/remove/${pooja._id}`} className="text-primary mr-4 hover:text-orange-400">Remove</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Manage;