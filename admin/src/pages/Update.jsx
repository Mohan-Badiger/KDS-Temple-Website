import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pooja, setPooja] = useState({
    name: '',
    description: '',
    price: '', // Base Price
  });
  const [temples, setTemples] = useState([]);
  const [selectedTemples, setSelectedTemples] = useState([]);
  const [customConfigs, setCustomConfigs] = useState({});
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSamePrice, setIsSamePrice] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poojaRes, templesRes] = await Promise.all([
          axios.get(`${backendUrl}/api/pooja/${id}`),
          axios.get(`${backendUrl}/api/temple/list`)
        ]);

        if (poojaRes.data.success) {
          const p = poojaRes.data.pooja;
          setPooja({
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
          });
          setCurrentImage(p.image || '');
          
          // Map existing temples and configs
          if (p.temples && p.temples.length > 0) {
            const ids = p.temples.map(t => t.templeId?._id || t.templeId);
            setSelectedTemples(ids);
            
            const configs = {};
            p.temples.forEach(t => {
              configs[t.templeId?._id || t.templeId] = {
                price: t.price,
                isActive: t.isActive
              };
            });
            setCustomConfigs(configs);

            // Check if all prices are different from base price
            const allSame = p.temples.every(t => t.price === p.price);
            setIsSamePrice(allSame);
          } else if (p.temple) {
             // Legacy support
             const tid = p.temple?._id || p.temple;
             setSelectedTemples([tid]);
             setCustomConfigs({ [tid]: { price: p.price, isActive: true } });
          }
        } else {
          setError('Pooja not found');
        }

        if (templesRes.data.success) {
          setTemples(templesRes.data.temples);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Pooja not found or server error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setPooja({ ...pooja, [e.target.name]: e.target.value });
  };

  const handleTempleToggle = (tid) => {
    setSelectedTemples(prev => 
      prev.includes(tid) ? prev.filter(id => id !== tid) : [...prev, tid]
    );
  };

  const handleCustomChange = (tid, field, value) => {
    setCustomConfigs(prev => ({
      ...prev,
      [tid]: {
        ...(prev[tid] || { price: pooja.price, isActive: true }),
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTemples.length === 0) {
      toast.error("Please select at least one temple");
      return;
    }
    setIsUpdating(true);

    try {
      const templesData = selectedTemples.map(tid => ({
        templeId: tid,
        price: isSamePrice ? Number(pooja.price) : Number(customConfigs[tid]?.price || pooja.price),
        isActive: customConfigs[tid]?.isActive ?? true
      }));

      const formData = new FormData();
      formData.append('name', pooja.name);
      formData.append('description', pooja.description);
      formData.append('price', pooja.price);
      formData.append('temples', JSON.stringify(templesData));
      if (newImage) {
        formData.append('image', newImage);
      }

      const response = await axios.put(`${backendUrl}/api/pooja/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Master Pooja updated successfully!');
        navigate('/pooja-manage/manage');
      } else {
        toast.error('Failed to update pooja.');
      }
    } catch (err) {
      console.error('Error updating pooja:', err);
      toast.error('Error updating pooja.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 font-primary">
       <div className="w-8 h-8 border-2 border-stone-200 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );
  if (error) return <p className="text-red-600 font-primary p-6">{error}</p>;

  return (
    <div className="max-w-4xl p-6 bg-white font-primary font-medium text-gray-800">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-1.5 h-10 bg-orange-400 rounded-sm"></div>
        <h2 className="text-3xl tracking-tight uppercase">Update Divine Service</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Side: Master Details */}
        <div className="space-y-6">
           {currentImage && (
             <div className="mb-6">
               <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-2">Sacred Visualization</p>
               <img
                 src={currentImage}
                 alt="Current"
                 className="w-full h-48 object-cover rounded-sm border border-stone-100 shadow-sm transition-transform hover:scale-[1.01]"
               />
             </div>
           )}

           <div className="space-y-2">
             <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Service Name</p>
             <input
               type="text"
               name="name"
               value={pooja.name}
               onChange={handleChange}
               className="w-full p-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all font-medium"
               required
             />
           </div>

           <div className="space-y-2">
             <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Sacred Description</p>
             <textarea
               name="description"
               value={pooja.description}
               onChange={handleChange}
               className="w-full h-40 resize-none p-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all text-sm leading-relaxed"
               required
             />
           </div>

           <div className="space-y-2">
             <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Update Ritual Icon</p>
             <input
               type="file"
               accept="image/*"
               onChange={(e) => setNewImage(e.target.files[0])}
               className="w-full p-3 border border-stone-100 bg-stone-50 text-[10px] text-stone-400 uppercase tracking-widest rounded-sm file:mr-4 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-[10px] file:uppercase file:bg-orange-50 file:text-orange-500 hover:file:bg-orange-100 transition-all cursor-pointer"
             />
           </div>
        </div>

        {/* Right Side: Deployment */}
        <div className="space-y-8">
           <div className="space-y-2">
             <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Default Ritual Offering (₹)</p>
             <input
               type="number"
               name="price"
               value={pooja.price}
               onChange={handleChange}
               className="w-full p-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 bg-orange-50/10 font-bold"
               required
             />
           </div>

           <div className="space-y-4">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400"></span>
                Temple Deployments
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {temples.map((temple) => (
                  <label 
                    key={temple._id} 
                    className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-all ${
                      selectedTemples.includes(temple._id) 
                        ? 'border-orange-400 bg-orange-50/40 shadow-sm' 
                        : 'border-stone-100 bg-white hover:border-stone-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTemples.includes(temple._id)}
                      onChange={() => handleTempleToggle(temple._id)}
                      className="accent-orange-400"
                    />
                    <span className="text-[11px] uppercase tracking-tight">{temple.name}</span>
                  </label>
                ))}
              </div>
           </div>

           {selectedTemples.length > 0 && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6 bg-stone-50 border border-stone-100 p-6 rounded-sm shadow-inner"
             >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Temple Specifics</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest italic">Sync Price</span>
                    <div 
                      onClick={() => setIsSamePrice(!isSamePrice)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${isSamePrice ? 'bg-orange-400' : 'bg-stone-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isSamePrice ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </label>
                </div>

                {!isSamePrice && (
                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedTemples.map(tid => {
                      const temple = temples.find(t => t._id === tid);
                      return (
                        <div key={tid} className="flex items-center justify-between gap-4 bg-white p-3 border border-stone-200 rounded-sm">
                           <span className="text-[10px] uppercase font-bold truncate max-w-[120px]">{temple?.name}</span>
                           <div className="flex items-center gap-2 w-32 shrink-0">
                             <span className="text-[10px] text-stone-300">₹</span>
                             <input
                               type="number"
                               placeholder={pooja.price}
                               value={customConfigs[tid]?.price || ''}
                               onChange={(e) => handleCustomChange(tid, 'price', e.target.value)}
                               className="w-full text-xs p-1.5 border-b border-stone-100 outline-0 focus:border-orange-200 rounded-none bg-transparent"
                             />
                           </div>
                        </div>
                      )
                    })}
                  </div>
                )}
             </motion.div>
           )}

           <button
             type="submit"
             disabled={isUpdating}
             className="w-full bg-orange-400 text-white py-5 outline-0 hover:bg-orange-500 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-[11px] font-bold rounded-sm shadow-md disabled:opacity-50 mt-8 h-16"
           >
             {isUpdating ? 'Sealing Updates...' : 'Synchronize Master Ritual'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default Update;
