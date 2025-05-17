import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false); // For button loading state

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('date', date);
      formData.append('image', image);

      const response = await axios.post(`${backendUrl}/api/pooja/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Pooja Added Successfully');

        // Reset all fields
        setName('');
        setDescription('');
        setPrice('');
        setImage(null);
        setDate('');
        // Also reset file input value
        document.getElementById('imageInput').value = '';
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
        <input
          type="text"
          name="name"
          placeholder="Pooja Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border outline-0"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-30 resize-none p-2 border outline-0"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border outline-0"
          required
        />

        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border outline-0"
          required
        />

        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border outline-0"
          required
        />

        <button
          type="submit"
          className="w-full bg-primary text-white p-3 outline-0 hover:bg-amber-500 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Pooja'}
        </button>
      </form>
    </div>
  );
};

export default Add;
