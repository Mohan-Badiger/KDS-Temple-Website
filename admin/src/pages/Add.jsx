import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Add = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const duplicateId = queryParams.get('duplicateId');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // Base Price
  const [image, setImage] = useState(null);
  const [selectedTemples, setSelectedTemples] = useState([]);
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSamePrice, setIsSamePrice] = useState(true);
  const [customConfigs, setCustomConfigs] = useState({});

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/temple/all`);
        if (response.data.success) {
          setTemples(response.data.temples);
        }
      } catch (error) {
        toast.error("Error fetching temples");
      }
    };
    fetchTemples();
  }, []);

  useEffect(() => {
    if (duplicateId) {
       const fetchDuplicateData = async () => {
          try {
             const res = await axios.get(`${backendUrl}/api/pooja/${duplicateId}`);
             if (res.data.success) {
                const p = res.data.pooja;
                setName(`${p.name} (Copy)`);
                setDescription(p.description);
                setPrice(p.basePrice || p.price);
                
                if (p.temples && p.temples.length > 0) {
                   setSelectedTemples(p.temples.map(t => t.templeId?._id || t.templeId));
                   const configs = {};
                   p.temples.forEach(t => {
                      configs[t.templeId?._id || t.templeId] = { price: t.price, isActive: t.isActive };
                   });
                   setCustomConfigs(configs);
                   const allSame = p.temples.every(t => t.price === (p.basePrice || p.price));
                   setIsSamePrice(allSame);
                }
                toast.info("Pooja data duplicated. Please review and upload a new image.");
             }
          } catch (err) {
             console.error("Error duplicating pooja:", err);
          }
       };
       fetchDuplicateData();
    }
  }, [duplicateId]);

  const handleTempleToggle = (id) => {
    setSelectedTemples(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleCustomChange = (id, field, value) => {
    setCustomConfigs(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { price: price, isActive: true }),
        [field]: value
      }
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (selectedTemples.length === 0) {
      toast.error("Please select at least one temple");
      return;
    }
    setLoading(true);

    try {
      const templesData = selectedTemples.map(id => ({
        templeId: id,
        price: isSamePrice ? Number(price) : Number(customConfigs[id]?.price || price),
        isActive: customConfigs[id]?.isActive ?? true
      }));

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price); // Base price
      formData.append('temples', JSON.stringify(templesData));
      if (image) formData.append('image', image);

      const response = await axios.post(`${backendUrl}/api/pooja/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Pooja Added Successfully');
        setName('');
        setDescription('');
        setPrice('');
        setImage(null);
        setSelectedTemples([]);
        setCustomConfigs({});
        setIsSamePrice(true);
        if (document.getElementById('imageInput')) {
          document.getElementById('imageInput').value = '';
        }
      } else {
        toast.error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error adding pooja');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl py-6 bg-white font-primary font-medium text-gray-800">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1.5 h-10 bg-orange-400 rounded-sm"></div>
        <h2 className="text-3xl tracking-tight uppercase">Add Master Pooja</h2>
      </div>

      <form onSubmit={onSubmitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Side: Basic Info */}
        <div className="space-y-6">
           <div className="space-y-2">
             <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Divine Service Name</p>
             <input
               type="text"
               placeholder="e.g. Maha Abhishek"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="w-full p-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all"
               required
             />
           </div>

           <div className="space-y-2">
             <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Description</p>
             <textarea
               placeholder="Puranic significance and ritual details..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="w-full h-32 resize-none p-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all"
               required
             />
           </div>

           <div className="space-y-2">
             <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Base Price (₹)</p>
             <input
               type="number"
               placeholder="1000"
               value={price}
               onChange={(e) => setPrice(e.target.value)}
               className="w-full p-3 border border-stone-200 outline-0 rounded-sm focus:border-orange-400 focus:ring-4 focus:ring-orange-50 transition-all"
               required
             />
           </div>

           <div className="space-y-2">
             <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Pooja Image</p>
             <input
               type="file"
               id="imageInput"
               accept="image/*"
               onChange={(e) => setImage(e.target.files[0])}
               className="w-full p-4 border border-stone-100 bg-stone-50 text-[10px] text-stone-400 uppercase tracking-widest rounded-sm file:mr-4 file:py-1 file:px-2 file:rounded-sm file:border-0 file:text-[10px] file:uppercase file:bg-orange-50 file:text-orange-500 hover:file:bg-orange-100 transition-all cursor-pointer"
               required
             />
           </div>
        </div>

        {/* Right Side: Temple Assignment */}
        <div className="space-y-8">
           <div className="space-y-4">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400"></span>
                Temple Assignment
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {temples.map((temple) => (
                  <label 
                    key={temple._id} 
                    className={`flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-all ${
                      selectedTemples.includes(temple._id) 
                        ? 'border-orange-400 bg-orange-50/30' 
                        : 'border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTemples.includes(temple._id)}
                      onChange={() => handleTempleToggle(temple._id)}
                      className="accent-orange-400"
                    />
                    <span className="text-xs uppercase tracking-tight">{temple.name}</span>
                  </label>
                ))}
              </div>
           </div>

           {selectedTemples.length > 0 && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6 bg-stone-50/50 p-6 rounded-md border border-stone-100"
             >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Temple-wise Customization</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">Same for all</span>
                    <div 
                      onClick={() => setIsSamePrice(!isSamePrice)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${isSamePrice ? 'bg-orange-400' : 'bg-stone-300'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isSamePrice ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </label>
                </div>

                {!isSamePrice && (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedTemples.map(id => {
                      const temple = temples.find(t => t._id === id);
                      return (
                        <div key={id} className="grid grid-cols-2 gap-4 items-center bg-white p-3 border border-stone-200 rounded-sm">
                           <span className="text-[10px] uppercase font-bold truncate">{temple?.name}</span>
                           <div className="flex items-center gap-2">
                             <input
                               type="number"
                               placeholder={price || "Price"}
                               value={customConfigs[id]?.price || ''}
                               onChange={(e) => handleCustomChange(id, 'price', e.target.value)}
                               className="w-full text-xs p-2 border border-stone-100 outline-0 focus:border-orange-200 focus:ring-0 rounded-sm"
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
             className="w-full bg-orange-400 text-white py-5 outline-0 hover:bg-orange-500 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-xs font-bold rounded-sm shadow-sm disabled:opacity-50 mt-10 h-16"
             disabled={loading}
           >
             {loading ? 'Committing to Records...' : 'Register Master Pooja'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
