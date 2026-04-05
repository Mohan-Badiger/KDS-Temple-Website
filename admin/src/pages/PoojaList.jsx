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

  if (loading) return (
    <div className="flex items-center justify-center py-20 font-primary">
       <div className="w-8 h-8 border-2 border-stone-200 border-t-orange-400 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full py-6 bg-white font-primary text-gray-800">
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-stone-100">
        <div>
          <h1 className="text-2xl uppercase tracking-tight text-gray-900">Divine Services</h1>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Full registry of temple poojas</p>
        </div>
        <div className="bg-orange-50 px-4 py-1 border border-orange-100 rounded-sm">
           <span className="text-[10px] text-orange-500 uppercase tracking-widest">{poojas.length} Services</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {poojas.map((pooja) => (
          <div key={pooja._id} className="bg-white border border-stone-200 rounded-sm overflow-hidden hover:shadow-sm transition-all group">
            <div className="relative h-48 w-full p-2 pb-0">
              <img 
                className="w-full h-full object-cover rounded-sm" 
                src={pooja.image} 
                alt={pooja.name} 
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 text-xs rounded-sm border border-stone-100 shadow-sm">
                  ₹{pooja.price}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-1">
                  {pooja.temple?.name || "Kadasiddeshwar Temple"}
                </p>
                <h2 className="text-lg text-gray-900 uppercase tracking-tight leading-tight transition-colors">
                  {pooja.name}
                </h2>
              </div>
              
              <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed mb-6 h-12">
                {pooja.description}
              </p>
              
              <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-orange-400 rounded-sm"></div>
                   <span className="text-[9px] text-stone-400 uppercase tracking-widest leading-none">Registered Service</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {poojas.length === 0 && (
         <div className="text-center py-20 bg-stone-50 border border-dashed border-stone-200 rounded-sm mt-4">
           <p className="text-stone-400 uppercase tracking-widest text-xs">No records found.</p>
         </div>
      )}
    </div>
  );
};

export default PoojaList;
