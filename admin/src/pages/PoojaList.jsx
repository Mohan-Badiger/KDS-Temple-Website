import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const PoojaList = () => {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoojas = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/pooja/all`);
        if (res.data.success) {
          setPoojas(res.data.poojas.reverse());
        }
      } catch (error) {
        console.error('Error fetching poojas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoojas();
  }, []);

  if (loading) return <p className="mt-10 text-lg">Loading Poojas...</p>;

  return (
    <div className="w-full py-6 bg-white font-primary font-medium">
      <h1 className="text-lg sm:text-2xl">Pooja List</h1>

      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
          {poojas.map((pooja) => (
            <div key={pooja._id} className="bg-white relative border border-gray-300 hover:shadow-md transition duration-300 mt-5">
              <img className="rounded p-2 w-full h-48 object-cover" src={pooja.image} alt={pooja.name} />
              <div className="py-6 px-6 bg-white">
                <h1 className="text-gray-700 font-medium text-lg sm:text-2xl mb-3 hover:text-gray-900 hover:cursor-pointer">{pooja.name}</h1>
                <p className="text-gray-700 tracking-wide">{pooja.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">Date: {new Date(pooja.date).toLocaleDateString()}</p>
                  <span className="text-lg font-bold">₹{pooja.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoojaList;
