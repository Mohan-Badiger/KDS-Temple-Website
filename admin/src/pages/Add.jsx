import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [templeId, setTempleId] = useState('');
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/temple/all`);
        if (response.data.success) {
          setTemples(response.data.temples);
          if (response.data.temples.length > 0) {
            setTempleId(response.data.temples[0]._id);
          }
        }
      } catch (error) {
        toast.error("Error fetching temples");
      }
    };
    fetchTemples();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!templeId) {
      toast.error("Please select a temple");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('temple', templeId);
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
    <div className="max-w-lg py-6 bg-white font-primary font-medium">
      <h2 className="text-2xl mb-6">Add Pooja</h2>

      <form onSubmit={onSubmitHandler} className="space-y-4">
        <select
          value={templeId}
          onChange={(e) => setTempleId(e.target.value)}
          className="w-full p-2 border outline-0 bg-white"
          required
        >
          <option value="" disabled>Select Temple</option>
          {temples.map((temple) => (
            <option key={temple._id} value={temple._id}>{temple.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Pooja Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border outline-0"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-30 resize-none p-2 border outline-0"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border outline-0"
          required
        />

        <div className="space-y-1">
          <label className="text-xs text-gray-400">Pooja Image</label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border outline-0 text-xs text-gray-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white p-3 outline-0 hover:bg-amber-500 disabled:opacity-70 transition-colors"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Pooja'}
        </button>
      </form>
    </div>
  );
};

export default Add;
