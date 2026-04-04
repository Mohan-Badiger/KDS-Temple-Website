// import React, { useContext, useEffect, useState } from 'react';
// import { TempleContext } from '../context/TempleContext.jsx';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Login = () => {
//   const [currentState, setCurrentState] = useState('Login'); // Login, Sign Up, Forgot Password, Verify OTP
//   const { token, setToken, navigate, backendUrl } = useContext(TempleContext);

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       if (currentState === 'Forgot Password') {
//         handleForgotPasswordStart();
//       } else if (currentState === 'Verify OTP') {
//         handleVerifyOtpAndReset();
//       }
//     }
//   };

//   const handleForgotPasswordStart = async () => {
//     if (!email) return toast.error('Please enter your email');

//     try {
//       setLoading(true);
//       const res = await axios.post(`${backendUrl}/api/user/request-reset-otp`, { email });
//       if (res.data.success) {
//         toast.success('OTP sent to your email');
//         setCurrentState('Verify OTP');
//       } else {
//         toast.error(res.data.message || 'Email not found');
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtpAndReset = async () => {
//     if (password !== confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, {
//         email,
//         otp,
//         password,
//       });
//       if (res.data.success) {
//         toast.success('Password updated successfully');
//         setCurrentState('Login');
//         setOtp('');
//         setPassword('');
//         setConfirmPassword('');
//       } else {
//         toast.error(res.data.message || 'Invalid OTP');
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       if (currentState === 'Sign Up') {
//         const res = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
//         if (res.data.success) {
//           setToken(res.data.token);
//           localStorage.setItem('token', res.data.token);
//           toast.success('You are registered');
//         } else {
//           toast.error(res.data.message);
//         }
//       } else if (currentState === 'Login') {
//         const res = await axios.post(`${backendUrl}/api/user/login`, { email, password });
//         if (res.data.success) {
//           setToken(res.data.token);
//           localStorage.setItem('token', res.data.token);
//         } else {
//           toast.error(res.data.message);
//         }
//       }
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) navigate('/');
//   }, [token, navigate]);

//   return (
//     <form
//       onSubmit={onSubmitHandler}
//       className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 pb-15"
//     >
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="prata-regular text-3xl">{currentState}</p>
//         <hr className="border-none h-[3px] mt-2 w-8 bg-gray-800" />
//       </div>

//       {currentState === 'Sign Up' && (
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
//           className="w-full px-3 py-2 border border-gray-800"
//           required
//         />
//       )}

//       {currentState !== 'Verify OTP' && (
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           onKeyDown={currentState === 'Forgot Password' ? handleKeyDown : undefined}
//           className="w-full px-3 py-2 border border-gray-800"
//           required
//         />
//       )}

//       {(currentState === 'Login' || currentState === 'Sign Up') && (
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full px-3 py-2 border border-gray-800"
//           required
//         />
//       )}

//       {currentState === 'Verify OTP' && (
//         <>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="w-full px-3 py-2 border border-gray-800"
//             required
//           />
//           <input
//             type="password"
//             placeholder="New Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="w-full px-3 py-2 border border-gray-800"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="w-full px-3 py-2 border border-gray-800"
//             required
//           />
//         </>
//       )}

//       <div className="w-full flex justify-between text-sm">
//         {currentState === 'Login' && (
//           <p onClick={() => setCurrentState('Forgot Password')} className="cursor-pointer">
//             Forgot your password?
//           </p>
//         )}
//         {(currentState === 'Sign Up' ||
//           currentState === 'Forgot Password' ||
//           currentState === 'Verify OTP') && (
//           <p onClick={() => setCurrentState('Login')} className="cursor-pointer">
//             Login Here
//           </p>
//         )}
//         {currentState === 'Login' && (
//           <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">
//             Create Account
//           </p>
//         )}
//       </div>

//       {currentState === 'Forgot Password' ? (
//         <button
//           type="button"
//           onClick={handleForgotPasswordStart}
//           className="bg-primary text-white font-sm px-8 py-2 mt-4"
//           disabled={loading}
//         >
//           {loading ? 'Sending OTP...' : 'Send OTP'}
//         </button>
//       ) : currentState === 'Verify OTP' ? (
//         <button
//           type="button"
//           onClick={handleVerifyOtpAndReset}
//           className="bg-primary text-white font-sm px-8 py-2 mt-4"
//           disabled={loading}
//         >
//           {loading ? 'Verifying & Resetting...' : 'Verify OTP & Reset'}
//         </button>
//       ) : (
//         <button
//           type="submit"
//           className="bg-primary text-white font-sm px-8 py-2 mt-4"
//           disabled={loading}
//         >
//           {loading
//             ? currentState === 'Login'
//               ? 'Logging In...'
//               : 'Signing Up...'
//             : currentState === 'Login'
//             ? 'Log In'
//             : 'Sign Up'}
//         </button>
//       )}
//     </form>
//   );
// };

// export default Login;


//=================================================================================================================================
//=================================================================================================================================
//=================================================================================================================================

import React, { useContext, useEffect, useState, useRef } from 'react';
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

  const [emailToVerify, setEmailToVerify] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  const startResendTimer = () => {
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentState === 'Forgot Password') handleForgotPasswordStart();
      else if (currentState === 'Verify OTP') handleVerifyOtpAndReset();
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (currentState === 'Login') {
        const res = await axios.post(`${backendUrl}/api/user/login`, { email, password });
        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
          toast.success('Logged in successfully');
        } else {
          toast.error(res.data.message);
        }
      } else if (currentState === 'Sign Up') {
        if (!emailVerified) return toast.error('Please verify your email first');
        if (password !== confirmPassword) return toast.error('Passwords do not match');

        const res = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email: emailToVerify,
          password,
        });

        if (res.data.success) {
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
          toast.success('Account created and logged in successfully');
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!emailToVerify) return toast.error('Please enter an email');
    try {
      setLoadingOtp(true);
      const res = await axios.post(`${backendUrl}/api/user/request-register-otp`, { email: emailToVerify });
      if (res.data.success) {
        toast.success('OTP sent to your email');
        setEmailVerificationSent(true);
        startResendTimer();
      } else {
        toast.error(res.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) return toast.error('Please enter OTP');
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/verify-register-otp`, {
        email: emailToVerify,
        otp: emailOtp,
      });
      if (res.data.success) {
        toast.success('Email verified! You can now create your account.');
        setEmailVerified(true);
        setEmail(emailToVerify);
      } else {
        toast.error(res.data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
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
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndReset = async () => {
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, {
        email,
        otp,
        password,
      });
      if (res.data.success) {
        toast.success('Password updated');
        setCurrentState('Login');
        setOtp('');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate('/');
    return () => clearInterval(timerRef.current);
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

      {/* LOGIN */}
      {currentState === 'Login' && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
        </>
      )}

      {/* SIGN UP */}
      {currentState === 'Sign Up' && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
            className="w-full px-3 py-2 border border-gray-800"
            required
          />
          <div className="flex w-full gap-2">
            <input
              type="email"
              placeholder="Email"
              value={emailToVerify}
              onChange={(e) => {
                setEmailToVerify(e.target.value);
                setEmailVerificationSent(false);
                setEmailVerified(false);
                setResendTimer(0);
              }}
              className="w-full px-3 py-2 border border-gray-800"
              required
            />
            <button
              type="button"
              onClick={handleSendEmailOtp}
              disabled={loadingOtp || resendTimer > 0}
              className={`bg-primary text-white px-4 ${loadingOtp || resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loadingOtp ? 'Sending OTP...' : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Verify'}
            </button>
          </div>

          {emailVerificationSent && !emailVerified && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-800 mt-2"
              />
              <button
                type="button"
                onClick={handleVerifyEmailOtp}
                className="bg-primary text-white px-6 py-2 mt-1"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Confirm OTP'}
              </button>
            </>
          )}

          {emailVerified && (
            <>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-800 mt-2"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-800"
                required
              />
              <button type="submit" className="bg-primary text-white px-8 py-2 mt-2" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </>
          )}
        </>
      )}

      {/* FORGOT PASSWORD */}
      {currentState === 'Forgot Password' && (
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 border border-gray-800"
          required
        />
      )}

      {/* RESET PASSWORD */}
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

      {/* LINKS */}
      <div className="w-full flex justify-between text-sm">
        {currentState === 'Login' && (
          <p onClick={() => setCurrentState('Forgot Password')} className="cursor-pointer">
            Forgot your password?
          </p>
        )}
        {(currentState === 'Sign Up' || currentState === 'Forgot Password' || currentState === 'Verify OTP') && (
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

      {/* BUTTONS */}
      {currentState === 'Forgot Password' && (
        <button
          type="button"
          onClick={handleForgotPasswordStart}
          className="bg-primary text-white font-sm px-8 py-2 mt-4"
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      )}

      {currentState === 'Verify OTP' && (
        <button
          type="button"
          onClick={handleVerifyOtpAndReset}
          className="bg-primary text-white font-sm px-8 py-2 mt-4"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify & Reset'}
        </button>
      )}

      {currentState === 'Login' && (
        <button
          type="submit"
          className="bg-primary text-white font-sm px-8 py-2 mt-4"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      )}
    </form>
  );
};

export default Login;


