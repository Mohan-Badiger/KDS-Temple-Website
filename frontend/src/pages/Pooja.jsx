import React, { useContext, useEffect, useState } from "react";
import { TempleContext } from "../context/TempleContext";
import TotalBooking from "../components/TotalBooking";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const PoojaCard = () => {
  const { selectedTemple, setSelectedTemple, selectedPoojas, totalAmount, handleCheckboxChange, navigate } = useContext(TempleContext);
  const [poojaList, setPoojaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedTemple) {
      navigate("/temples");
      return;
    }

    const fetchPoojas = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/pooja/all?templeId=${selectedTemple._id}`);
        if (res.data.success) {
          setPoojaList(res.data.poojas);
        }
      } catch (error) {
        console.error("Failed to fetch poojas", error);
        toast.error("Failed to load poojas for this temple.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoojas();
  }, [selectedTemple, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='font-primary px-2'
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 mt-10 gap-4 border-b border-stone-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-orange-400 rounded-sm"></div>
          <div>
            <p className="text-[10px] text-orange-500 uppercase tracking-widest mb-1">Divine Services at</p>
            <h1 className="text-2xl sm:text-3xl text-gray-900 tracking-tight uppercase">{selectedTemple?.name}</h1>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedTemple(null);
            navigate("/temples");
          }}
          className="text-[12px] text-white uppercase tracking-[0.1em] transition-all duration-300 border bg-orange-400 px-5 py-2.5 rounded-sm hover:border-orange-500 active:scale-95"
        >
          Change Temple
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-10 h-10 border-2 border-stone-100 border-t-orange-400 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest animate-pulse">Fetching blessed sevas...</p>
        </div>
      ) : (
        <div className="w-full">
          {poojaList.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 rounded-sm border border-dashed border-stone-200">
              <p className="text-stone-400 uppercase tracking-widest text-xs">No poojas available for this temple yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {poojaList.map((pooja, index) => {
                const isSelected = selectedPoojas.some(p => p._id === pooja._id);

                return (
                  <motion.div
                    key={pooja._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white border rounded-sm transition-all duration-300 group flex flex-col ${isSelected ? "border-orange-400 shadow-md" : "border-stone-200 hover:shadow-sm"
                      }`}
                  >
                    <div className="relative h-48 w-full p-2 pb-0">
                      <img className="rounded-sm w-full h-full object-cover" src={pooja.image} alt={pooja.name} />
                    </div>
                    <div className="py-6 px-6 flex-grow flex flex-col bg-white">
                      <h3 className={`text-xl mb-2 tracking-tight uppercase transition-colors ${isSelected ? 'text-orange-500' : 'text-gray-900'}`}>{pooja.name}</h3>
                      <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-2">{pooja.description}</p>

                      <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                        <label className="flex items-center cursor-pointer group/check">
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() => handleCheckboxChange(pooja)}
                          />
                          <div className={`w-4 h-4 mr-2.5 border rounded-[2px] flex flex-shrink-0 items-center justify-center transition-all duration-200 ${isSelected ? 'bg-orange-400 border-orange-400' : 'bg-transparent border-stone-300 group-hover/check:border-orange-400'
                            }`}>
                            {isSelected && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                          <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${isSelected ? 'text-orange-500' : 'text-stone-400 group-hover/check:text-orange-400'
                            }`}>
                            {isSelected ? 'Selected' : 'Select Pooja'}
                          </span>
                        </label>
                        <span className="text-lg text-gray-900 tracking-tight">₹{pooja.price}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px] p-6 rounded-sm'>
          <TotalBooking total={totalAmount} />
          <div className='w-full text-end mt-6'>
            <button
              className='w-full bg-orange-400 text-white text-[11px] uppercase tracking-[0.2em] px-10 py-5 rounded-sm hover:bg-orange-500 transition-colors shadow-sm active:scale-95'
              onClick={() => {
                if (selectedPoojas.length === 0) {
                  toast.error("Please select pooja before proceeding.");
                } else {
                  navigate('/payment');
                }
              }}
            >
              Confirm Selection & Proceed
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PoojaCard;
