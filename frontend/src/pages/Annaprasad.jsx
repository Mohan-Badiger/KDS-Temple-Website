import React, { useContext, useEffect, useState } from 'react';
import { TempleContext } from '../context/TempleContext.jsx';
import { toast } from 'react-toastify';
import annaprasad from '../assets/annaprasad.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Annaprasad = () => {
  const { token, navigate } = useContext(TempleContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigateToHome = useNavigate();

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

  const handleChange = (setter) => (e) => setter(e.target.value);
  const handleCheckboxChange = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handlePayment = async () => {
    const annaprasadAmount = customAmount.trim() || amount;
    const parsedAmount = parseFloat(annaprasadAmount);

    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Please fill in all required fields and choose a payment method.");
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
        { amount: parsedAmount * 100 }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Annaprasad Contribution',
        description: 'Contribute to Annaprasad',
        order_id: order.id,
        handler: async function (response) {
          setLoading(true);

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
                firstName,
                lastName,
                phone,
                amount: parsedAmount,
                message,
              };

              const donationRes = await axios.post(
                `${backendUrl}/api/annaprasads/donate`,
                donationData,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (donationRes.data.success) {
                toast.success('Annaprasad contribution successful!');
                setFirstName('');
                setLastName('');
                setPhone('');
                setAmount('');
                setCustomAmount('');
                setMessage('');

                // Delay for smoother UX and ensure backend completes
                setTimeout(() => {
                  navigateToHome('/');
                }, 1000);
              } else {
                toast.error(donationRes.data.message || 'Donation failed');
              }
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Error verifying payment.');
            console.error('Payment verification error:', error);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info("Payment cancelled.");
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
    handlePayment(); //change it for original mode
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
          <div className="text-2xl text-gray-800 font-semibold">
            Processing... Please wait
          </div>
        </div>
      )}

      <div className="font-primary mt-6">
        <h2 className="text-2xl sm:text-4xl text-gray-800 text-center mb-4 mt-4">Annaprasad Contribution</h2>
        <div className="w-full flex justify-center">
          <div className="md:w-11/12 flex gap-10 flex-col sm:flex-row border-gray-200 sm:px-8 sm:mt-3">
            <div className="md:w-[460px]">
              <img
                src={annaprasad}
                alt="Annaprasad"
                className="w-full h-126 object-cover rounded"
              />
            </div>
            <form onSubmit={onSubmitHandler} className="flex flex-col mt-5 w-full md:w-1/2 gap-6">
              <div className="flex flex-col sm:flex-row sm:gap-4 gap-6 w-full">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={firstName}
                  required
                  onChange={e => setFirstName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  className="md:w-1/2 py-3 px-5 border border-gray-300"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  required
                  onChange={e => setLastName(e.target.value.replace(/[^a-zA-Z]/g, ''))}
                  className="md:w-1/2 py-3 px-5 border border-gray-300"
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

              <div className="flex justify-around gap-2 sm:gap-6 w-full">
                {['5001', '10001', '20001'].map((amt) => (
                  <label
                    key={amt}
                    className="flex items-center border border-gray-300 py-3 px-2 sm:px-5 w-1/3"
                  >
                    <input
                      type="radio"
                      name="amount"
                      value={amt}
                      checked={amount === amt}
                      onChange={() => handleCheckboxChange(amt)}
                      className="sm:mr-2 w-full sm:w-4 h-4 border-gray-300 rounded"
                    />
                    ₹{amt}
                  </label>
                ))}
              </div>

              <input
                type="number"
                name="customAmount"
                placeholder="Other Amount (₹) (Optional)"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setAmount('');
                }}
                className="w-full py-3 px-5 border border-gray-300"
              />

              <textarea
                name="message"
                placeholder="Message (Optional)"
                value={message}
                onChange={handleChange(setMessage)}
                className="w-full py-3 px-5 border border-gray-300 h-32 resize-none"
              />

              {/* <button
                type="submit"
                className="bg-primary hover:bg-orange-400 text-lg text-white py-3 w-full"
                disabled={loading}
              >
                {loading ? 'Processing Donation...' : 'Contribute Now'}
              </button> */}

              {/* Change Handlepayment() also */}
              <button
                //onClick={() => { toast.error("Payment Disabled for Demo Mode") }}
                className="w-full bg-primary text-lg text-white font-medium py-3 hover:bg-orange-400 transition duration-300"
              >Contribute Now
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Annaprasad;
