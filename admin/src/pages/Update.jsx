import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Update = () => {
  const { id } = useParams();
  const [pooja, setPooja] = useState({
    name: '',
    description: '',
    price: '',
    date: '',
  });
  const [currentImage, setCurrentImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pooja data
  useEffect(() => {
    const fetchPooja = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/pooja/${id}`);
        if (response.data.success) {
          const { name, description, image, price, date } = response.data.pooja;
          setPooja({
            name: name || '',
            description: description || '',
            price: price || '',
            date: date ? date.substring(0, 10) : '',
          });
          setCurrentImage(image || '');
        } else {
          setError('Pooja not found');
        }
      } catch (err) {
        console.error('Error fetching pooja:', err);
        setError('Pooja not found or server error');
      } finally {
        setLoading(false);
      }
    };

    fetchPooja();
  }, [id]);

  const handleChange = (e) => {
    setPooja({ ...pooja, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formData = new FormData();
      formData.append('name', pooja.name);
      formData.append('description', pooja.description);
      formData.append('price', pooja.price);
      formData.append('date', pooja.date);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-lg p-6 bg-white font-primary font-medium">
      <h2 className="text-2xl mb-3">Update Pooja</h2>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white">
        {currentImage && (
          <div className="mb-4">
            <p className="mb-1 font-medium">Current Image:</p>
            <img
              src={currentImage}
              alt="Current Pooja"
              className="w-full h-60 object-cover"
            />
          </div>
        )}

        <label className="block mb-2">Pooja Name:</label>
        <input
          type="text"
          name="name"
          value={pooja.name}
          onChange={handleChange}
          className="w-full p-2 border outline-0"
          required
        />

        <label className="block mt-2 mb-2">Description:</label>
        <textarea
          name="description"
          value={pooja.description}
          onChange={handleChange}
          className="w-full h-30 resize-none p-2 border outline-0"
          required
        />

        <label className="block mt-2 mb-2">New Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border outline-0"
        />

        <label className="block mt-2 mb-2">Price (₹):</label>
        <input
          type="number"
          name="price"
          value={pooja.price}
          onChange={handleChange}
          className="w-full p-2 border outline-0"
          required
        />

        <label className="block mt-2 mb-2">Date:</label>
        <input
          type="date"
          name="date"
          value={pooja.date}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-primary text-white p-3 outline-0 hover:bg-amber-500 disabled:opacity-70"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Pooja'}
        </button>
      </form>
    </div>
  );
};

export default Update;
