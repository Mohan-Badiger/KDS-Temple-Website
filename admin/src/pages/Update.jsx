import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Update = () => {
  const { id } = useParams();
  const [pooja, setPooja] = useState({
    name: '',
    description: '',
    price: '',
    templeId: '',
  });
  const [temples, setTemples] = useState([]);
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poojaRes, templesRes] = await Promise.all([
          axios.get(`${backendUrl}/api/pooja/${id}`),
          axios.get(`${backendUrl}/api/temple/all`)
        ]);

        if (poojaRes.data.success) {
          const { name, description, image, price, date, temple } = poojaRes.data.pooja;
          setPooja({
            name: name || '',
            description: description || '',
            price: price || '',
            templeId: temple || '', // temple is the ID from backend model
          });
          setCurrentImage(image || '');
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

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pooja.templeId) {
      toast.error("Please select a temple");
      return;
    }
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append('name', pooja.name);
      formData.append('description', pooja.description);
      formData.append('price', pooja.price);
      formData.append('temple', pooja.templeId);
      if (newImage) {
        formData.append('image', newImage);
      }

      const response = await axios.put(`${backendUrl}/api/pooja/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Pooja updated successfully!');
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
    <div className="max-w-lg p-6 bg-white font-primary font-medium">
      <h2 className="text-2xl mb-6">Update Pooja</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {currentImage && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-widest">Current Image</p>
            <img
              src={currentImage}
              alt="Current Pooja"
              className="w-full h-48 object-cover border border-stone-100 rounded-sm"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">Select Temple</label>
          <select
            name="templeId"
            value={pooja.templeId}
            onChange={handleChange}
            className="w-full p-2 border outline-0 bg-white"
            required
          >
            <option value="" disabled>Select Temple</option>
            {temples.map((temple) => (
              <option key={temple._id} value={temple._id}>{temple.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">Pooja Name</label>
          <input
            type="text"
            name="name"
            value={pooja.name}
            onChange={handleChange}
            className="w-full p-2 border outline-0"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">Description</label>
          <textarea
            name="description"
            value={pooja.description}
            onChange={handleChange}
            className="w-full h-32 resize-none p-2 border outline-0"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">Update Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border outline-0 text-xs text-gray-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-bold uppercase tracking-widest">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={pooja.price}
            onChange={handleChange}
            className="w-full p-2 border outline-0"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white p-3 outline-0 hover:bg-amber-500 disabled:opacity-70 transition-colors mt-6"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Pooja Details'}
        </button>
      </form>
    </div>
  );
};

export default Update;
