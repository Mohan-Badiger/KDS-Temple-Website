import React, { useContext, useEffect, useState } from 'react';
import { TempleContext } from '../context/TempleContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login'); // Login, Sign Up, Forgot Password, Verify OTP
  const { token, setToken, navigate, backendUrl } = useContext(TempleContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentState === 'Forgot Password') {
        handleForgotPasswordStart();
      } else if (currentState === 'Verify OTP') {
        handleVerifyOtpAndReset();
      }
    }
  };

  const handleForgotPasswordStart = async () => {
    if (!email) return toast.error('Please enter your email');

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/request-reset-otp`, { email });
      if (res.data.success) {
        toast.success('OTP sent to your email');
        setCurrentState('Verify OTP');
      } else {
        toast.error(res.data.message || 'Email not found');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, {
        email,
        otp,
        password,
      });
      if (res.data.success) {
        toast.success('Password updated successfully');
        setCurrentState('Login');
        setOtp('');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (currentState === 'Sign Up') {
        const res = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
          toast.success('You are registered');
        } else {
          toast.error(res.data.message);
        }
      } else if (currentState === 'Login') {
        const res = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 pb-15"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[3px] mt-2 w-8 bg-gray-800" />
      </div>

      {currentState === 'Sign Up' && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
          className="w-full px-3 py-2 border border-gray-800"
          required
        />
      )}

      {currentState !== 'Verify OTP' && (
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={currentState === 'Forgot Password' ? handleKeyDown : undefined}
          className="w-full px-3 py-2 border border-gray-800"
          required
        />
      )}

      {(currentState === 'Login' || currentState === 'Sign Up') && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800"
          required
        />
      )}

      {currentState === 'Verify OTP' && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
        </>
      )}

      <div className="w-full flex justify-between text-sm">
        {currentState === 'Login' && (
          <p onClick={() => setCurrentState('Forgot Password')} className="cursor-pointer">
            Forgot your password?
          </p>
        )}
        {(currentState === 'Sign Up' ||
          currentState === 'Forgot Password' ||
          currentState === 'Verify OTP') && (
          <p onClick={() => setCurrentState('Login')} className="cursor-pointer">
            Login Here
          </p>
        )}
        {currentState === 'Login' && (
          <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">
            Create Account
          </p>
        )}
      </div>

      {currentState === 'Forgot Password' ? (
        <button
          type="button"
          onClick={handleForgotPasswordStart}
          className="bg-primary text-white font-sm px-8 py-2 mt-4"
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      ) : currentState === 'Verify OTP' ? (
        <button
          type="button"
          onClick={handleVerifyOtpAndReset}
          className="bg-primary text-white font-sm px-8 py-2 mt-4"
          disabled={loading}
        >
          {loading ? 'Verifying & Resetting...' : 'Verify OTP & Reset'}
        </button>
      ) : (
        <button
          type="submit"
          className="bg-primary text-white font-sm px-8 py-2 mt-4"
          disabled={loading}
        >
          {loading
            ? currentState === 'Login'
              ? 'Logging In...'
              : 'Signing Up...'
            : currentState === 'Login'
            ? 'Log In'
            : 'Sign Up'}
        </button>
      )}
    </form>
  );
};

export default Login;
