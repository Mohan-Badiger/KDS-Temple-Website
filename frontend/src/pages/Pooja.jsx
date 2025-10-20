import React, { useContext, useEffect, useState } from "react";
import { TempleContext } from "../context/TempleContext";
import TotalBooking from "../components/TotalBooking";
import axios from "axios";
import { toast } from "react-toastify";

const PoojaCard = () => {
  const { backendUrl, selectedPoojas, totalAmount, handleCheckboxChange, navigate } = useContext(TempleContext);
  const [poojaList, setPoojaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoojas = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/pooja/all`);
        setPoojaList(res.data.poojas);
      } catch (error) {
        console.error("Failed to fetch poojas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoojas();
  }, [backendUrl]);

  return (
    <div className='font-primary'>
      <div className="flex justify-between items-center  mb-4 mt-6">
      <h1 className="text-2xl sm:text-3xl text-start">Book Your Pooja</h1>
    {/* <h2 onClick={()=>navigate('booking-confirmation')} className="sm:text-xl cursor-pointer font-medium border py-2 px-4">Booked Pooja</h2> */}
      </div>

      {loading ? (
        <p className="text-center mt-10">Loading poojas...</p>
      ) : (
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-13">
            {poojaList.map((pooja) => (
              <div key={pooja._id} className="bg-white border border-gray-300 hover:shadow-md transition duration-300 rounded-sm mt-5">
                <img className="rounded w-full p-2 h-48 object-cover" src={pooja.image} alt={pooja.name} />
                <div className="py-6 px-6">
                  <h1 className="text-gray-700 font-medium text-2xl mb-3 hover:text-gray-900">{pooja.name}</h1>
                  <p className="text-gray-700 tracking-wide">{pooja.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 w-4 h-4"
                        checked={selectedPoojas.some(p => p._id === pooja._id)}
                        onChange={() => handleCheckboxChange(pooja)}
                      />
                      Select
                    </label>
                    <span className="text-lg font-bold">₹{pooja.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <TotalBooking total={totalAmount} />
          <div className='w-full text-end'>
            <button
              className='bg-black text-white text-sm my-8 px-8 py-3'
              onClick={() => {
                if (selectedPoojas.length === 0) {
                  toast.error("Please select pooja before proceeding.");
                } else {
                  navigate('/payment');
                }
              }}
            >
              PROCEED TO CHECKOUT
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PoojaCard;
