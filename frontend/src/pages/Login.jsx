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
import { useLocation } from 'react-router-dom';
import Hero_img from '../assets/Hero_img.jpg';
import om from '../assets/om.png';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login'); // Login, Sign Up, Forgot Password, Verify OTP
  const { token, setToken, navigate, backendUrl } = useContext(TempleContext);
  const location = useLocation();

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
    if (token) {
      const destination = location.state?.from || '/';
      navigate(destination);
    }
    return () => clearInterval(timerRef.current);
  }, [token, navigate, location]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 md:py-16 font-primary">
      <div className="bg-white border border-stone-200/60 shadow-xl rounded-xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 min-h-[550px] transition-all duration-300">
        
        {/* Left Column - Form */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          {/* Logo & Trust Header */}
          <div className="flex items-center gap-2 mb-6 select-none">
            <img src={om} className="w-8 h-8 object-contain" alt="Om Logo" />
            <span className="font-cinzel tracking-widest text-xs font-bold text-stone-900 uppercase">Kadasiddeshwar</span>
          </div>

          <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold block mb-1">
            {currentState === 'Login' && "Welcome back Devotee !!!"}
            {currentState === 'Sign Up' && "Join our sacred community !!!"}
            {currentState === 'Forgot Password' && "Recover your access !!!"}
            {currentState === 'Verify OTP' && "Reset your password !!!"}
          </span>

          <h2 className="font-cinzel text-2xl sm:text-3xl font-semibold text-stone-950 mb-8 uppercase tracking-wider">
            {currentState === 'Verify OTP' ? 'Reset Password' : currentState}
          </h2>

          <form onSubmit={onSubmitHandler} className="space-y-4 w-full">
            {/* LOGIN */}
            {currentState === 'Login' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                    required
                  />
                </div>
              </>
            )}

            {/* SIGN UP */}
            {currentState === 'Sign Up' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                    className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Email</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={emailToVerify}
                      onChange={(e) => {
                        setEmailToVerify(e.target.value);
                        setEmailVerificationSent(false);
                        setEmailVerified(false);
                        setResendTimer(0);
                      }}
                      className="flex-grow px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSendEmailOtp}
                      disabled={loadingOtp || resendTimer > 0}
                      className={`px-5 py-3 bg-stone-900 text-white rounded-md text-xs uppercase tracking-widest font-bold hover:bg-orange-600 transition-all duration-300 cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loadingOtp ? '...' : resendTimer > 0 ? `${resendTimer}s` : 'Verify'}
                    </button>
                  </div>
                </div>

                {emailVerificationSent && !emailVerified && (
                  <div className="space-y-2 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Enter OTP</label>
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      className="w-full py-3 bg-stone-900 text-white rounded-md text-xs uppercase tracking-widest font-bold hover:bg-orange-600 transition-all duration-300 cursor-pointer shadow-md"
                      disabled={loading}
                    >
                      {loading ? 'Verifying...' : 'Confirm OTP'}
                    </button>
                  </div>
                )}

                {emailVerified && (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* FORGOT PASSWORD */}
            {currentState === 'Forgot Password' && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                  required
                />
              </div>
            )}

            {/* RESET PASSWORD */}
            {currentState === 'Verify OTP' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 border border-stone-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 rounded-md outline-none bg-stone-50/50 text-stone-800 transition-all duration-300 font-primary text-sm placeholder:text-stone-300"
                    required
                  />
                </div>
              </>
            )}

            {/* LINKS */}
            <div className="w-full flex justify-between text-xs text-stone-500 pt-2 select-none">
              {currentState === 'Login' && (
                <span onClick={() => setCurrentState('Forgot Password')} className="hover:text-orange-600 cursor-pointer transition-colors font-medium">
                  Forgot Password?
                </span>
              )}
              {(currentState === 'Sign Up' || currentState === 'Forgot Password' || currentState === 'Verify OTP') && (
                <span onClick={() => setCurrentState('Login')} className="hover:text-orange-600 cursor-pointer transition-colors font-medium">
                  Login Here
                </span>
              )}
              {currentState === 'Login' && (
                <span onClick={() => setCurrentState('Sign Up')} className="hover:text-orange-600 cursor-pointer transition-colors font-medium ml-auto">
                  Create Account
                </span>
              )}
            </div>

            {/* BUTTONS */}
            {currentState === 'Forgot Password' && (
              <button
                type="button"
                onClick={handleForgotPasswordStart}
                className="w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-md shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            )}

            {currentState === 'Verify OTP' && (
              <button
                type="button"
                onClick={handleVerifyOtpAndReset}
                className="w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-md shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Reset'}
              </button>
            )}

            {currentState === 'Login' && (
              <button
                type="submit"
                className="w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-md shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            )}

            {currentState === 'Sign Up' && emailVerified && (
              <button
                type="submit"
                className="w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-md shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </form>
        </div>

        {/* Right Column - Devotional Image & Banner */}
        <div className="md:col-span-5 relative bg-stone-950 hidden md:flex flex-col justify-between p-10 text-white overflow-hidden select-none">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img
              src={Hero_img}
              className="w-full h-full object-cover opacity-50 scale-105 transition-transform duration-[4000ms]"
              style={{ objectPosition: 'center 40%' }}
              alt="Temple Devotional Cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/20"></div>
          </div>

          {/* Top Info */}
          <div className="relative z-10 flex items-center gap-2">
            <img src={om} className="w-8 h-8 object-contain filter brightness-0 invert" alt="Om Emblem" />
            <span className="font-cinzel tracking-widest text-xs font-semibold text-orange-200">SHIVOHAM</span>
          </div>

          {/* Bottom Sloka / Watermark block */}
          <div className="relative z-10 space-y-4">
            <div className="border-l-2 border-orange-500/50 pl-4 space-y-2">
              <p className="font-kan text-sm sm:text-md text-orange-300 tracking-wide font-semibold leading-relaxed">
                ಓಂ ನಮಃ ಶಿವಾಯ
              </p>
              <p className="text-[10px] text-stone-300 font-light tracking-wide leading-relaxed">
                "Om Namah Shivaya" — Adorations to the Divine Lord Shiva.
              </p>
            </div>
            
            <p className="text-[10px] text-stone-400 font-light tracking-wider leading-relaxed pt-2 border-t border-white/5">
              Welcome to the digital portal of Shri Kadasiddeshwar Temples Trust. Sign in to schedule poojas, view sevas, and donate securely.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;


