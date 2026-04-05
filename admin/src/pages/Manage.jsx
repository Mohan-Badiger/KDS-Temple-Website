import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { motion } from 'framer-motion';

const Manage = () => {
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPoojas = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/pooja/all`);
      if (response.data.success && Array.isArray(response.data.poojas)) {
        setPoojas(response.data.poojas.reverse());
      } else {
        setPoojas([]);
      }
    } catch (err) {
      console.error("Error fetching poojas:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoojas();
  }, []);

  const handleDuplicate = (id) => {
    navigate(`/pooja-manage/add?duplicateId=${id}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 font-primary">
       <div className="w-8 h-8 border-2 border-stone-200 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );
  if (error) return <p className="text-red-600 font-primary p-6">Error loading poojas: {error}</p>;

  return (
    <div className='w-full py-6 bg-white font-primary font-medium text-gray-800'>
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-10 bg-orange-400 rounded-sm"></div>
        <h2 className="text-3xl tracking-tight uppercase">Divine Registry</h2>
      </div>

      {poojas.length === 0 ? (
        <div className="text-center py-24 bg-stone-50 border border-dashed border-stone-200 rounded-sm">
           <p className="text-stone-400 uppercase tracking-widest text-sm">No rituals found in the registry 🙏</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {poojas.map((pooja, index) => (
            <motion.div 
              key={pooja._id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 border border-stone-100 bg-white flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-orange-400 hover:shadow-sm transition-all group"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 flex-grow w-full">
                <div className="w-full sm:w-40 h-28 shrink-0 relative overflow-hidden bg-stone-50 rounded-sm shadow-inner">
                  <img src={pooja.image} alt={pooja.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[8px] uppercase tracking-widest px-2 py-1 rounded-none font-bold">
                    ID: {pooja._id.slice(-6)}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-medium tracking-tight uppercase">{pooja.name}</h3>
                    <span className="text-xs text-orange-500 font-bold tabular-nums bg-orange-50 px-2 py-0.5 rounded-sm">₹{pooja.basePrice || pooja.price}</span>
                  </div>
                  <p className="text-stone-400 text-xs italic line-clamp-1 mb-4 leading-relaxed font-light">{pooja.description}</p>
                  
                  {/* Assigned Temples Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pooja.temples && pooja.temples.length > 0 ? (
                      pooja.temples.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-stone-50 border border-stone-100 px-2.5 py-1 rounded-sm">
                           <div className={`w-1 h-1 rounded-full ${t.isActive ? 'bg-green-500' : 'bg-red-400'}`}></div>
                           <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">{t.templeId?.name || "Temple"}</span>
                        </div>
                      ))
                    ) : (
                       <div className="text-[9px] uppercase tracking-widest text-stone-300 italic">No temple deployments found</div>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-4 shrink-0 sm:self-end lg:self-center'>
                <button 
                  onClick={() => handleDuplicate(pooja._id)}
                  className="text-[10px] uppercase tracking-widest text-stone-400 hover:text-orange-400 flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  Duplicate
                </button>
                <div className="w-[1px] h-4 bg-stone-100 hidden sm:block"></div>
                <Link to={`/pooja-manage/update/${pooja._id}`} className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-orange-500 font-bold border-b border-stone-200 hover:border-orange-500 transition-all">Update</Link>
                <Link to={`/pooja-manage/remove/${pooja._id}`} className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 font-bold border-b border-stone-100 hover:border-red-500 transition-all">Remove</Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Manage;