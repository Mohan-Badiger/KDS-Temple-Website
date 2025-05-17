import React, { useContext, useEffect, useState } from 'react';
import { TempleContext } from '../context/TempleContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import Gallery1 from '../assets/Gallery-01.jpg';
import { useNavigate } from 'react-router-dom';

const Donation = () => {
  const { token } = useContext(TempleContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || amount < 1) {
      toast.error('Please enter a valid donation amount');
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error('Razorpay SDK failed to load.');
      return;
    }

    setLoading(true);

    try {
      const { data: order } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { amount: amount * 100 }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Temple Donation',
        description: 'Donation for Temple',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.message === 'Payment verified successfully') {
              const donationData = {
                firstName, lastName, phone, amount, message, date,
              };

              const donationRes = await axios.post(
                `${backendUrl}/api/donations/donate`,
                donationData,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (donationRes.data.success) {
                toast.success('Donation Successful');
                setFirstName('');
                setLastName('');
                setPhone('');
                setAmount('');
                setMessage('');
                setDate('');
                navigate('/');
              } else {
                toast.error(donationRes.data.message || 'Donation Failed');
              }
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Error verifying payment.');
            console.error('Payment verify error:', error);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info("Donation cancelled.");
          },
        },
        theme: {
          color: '#F97316',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error('Payment initiation failed.');
      console.error('Payment initiation error:', err);
      setLoading(false);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !amount || amount < 1) {
      toast.error('Please fill in all required fields correctly.');
      return;
    }
    handlePayment();
  };

  return (
    <div className="font-primary relative">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <div className="text-2xl font-medium text-gray-800">Processing your donation...</div>
        </div>
      )}

      <h2 className="text-4xl font-bold text-center mb-4 mt-4">Make a Donation</h2>
      <div className="w-full flex justify-center">
        <div className="md:w-11/12 flex gap-10 flex-col sm:flex-row border-gray-200 sm:px-8 sm:mt-3">
          <div className="md:w-[460px]">
            <img src={Gallery1} alt="Donation" className="w-full px-3 h-125 object-cover rounded" />
          </div>
          <form onSubmit={onSubmitHandler} className="flex flex-col mt-5 w-full md:w-1/2">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-6 w-full">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  className="md:w-1/2 text-gray-700 py-3 px-5 border border-gray-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  className="md:w-1/2 text-gray-700 py-3 px-5 border border-gray-300"
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={e => {
                  // Allow only digits and max 10 characters
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(val);
                }}
                className="w-full text-gray-700 py-3 px-5 border border-gray-300"
                pattern="[0-9]{10}"
                maxLength={10}
                required
              />
              <input
                type="number"
                placeholder="Donation Amount (₹)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-gray-700 py-3 px-5 border border-gray-300"
                min="1"
                required
              />
              <textarea
                placeholder="Message (Optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-gray-700 py-3 px-5 border border-gray-300 h-35 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-primary text-lg text-white font-medium py-3 hover:bg-orange-400 transition duration-300"
                disabled={loading}
              >
                {loading ? 'Processing Donation...' : 'Donate Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donation;
