import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Smartphone, ArrowRight, RefreshCcw, Loader2 } from 'lucide-react';

const Login = ({ setToken }) => {
    const [step, setStep] = useState('email'); // 'email' or 'otp'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const otpInputRef = useRef(null);

    // Handle Timer for Resend
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    // Auto-focus OTP input when reaching step 2
    useEffect(() => {
        if (step === 'otp' && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [step]);

    const requestOtp = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/admin/request-otp`, { email });
            if (response.data.success) {
                toast.success(response.data.message);
                setStep('otp');
                setTimer(60);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${backendUrl}/api/admin/verify-otp`, { email, otp });
            if (response.data.success) {
                toast.success('Login Successful');
                setToken(response.data.token);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[80vh] flex flex-col items-center justify-center p-4 font-primary'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='w-full max-w-md bg-white border border-stone-100 rounded-sm shadow-xl p-8'
            >
                {/* Header */}
                <div className='mb-10 text-center'>
                    <div className='inline-flex items-center gap-2 mb-2'>
                        <span className='w-8 h-[1px] bg-stone-300'></span>
                        <h1 className='text-2xl tracking-tighter uppercase font-light text-gray-900'>Temple Admin</h1>
                        <span className='w-8 h-[1px] bg-stone-300'></span>
                    </div>
                    <p className='text-[10px] uppercase tracking-[0.4em] text-stone-400'>Secure Access Portal</p>
                </div>

                <AnimatePresence mode='wait'>
                    {step === 'email' ? (
                        <motion.form
                            key='email-step'
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={requestOtp}
                            className='space-y-6'
                        >
                            <div className='space-y-2'>
                                <label className='text-[11px] uppercase tracking-widest text-stone-500 ml-1'>Admin Email</label>
                                <div className='relative'>
                                    <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-stone-300' size={18} />
                                    <input 
                                        type='email' 
                                        required
                                        placeholder='admin@example.com'
                                        className='w-full pl-10 pr-4 py-4 text-sm border border-stone-100 bg-stone-50/30 rounded-sm outline-none focus:border-orange-400 transition-all text-gray-700'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={loading}
                                type='submit' 
                                className='w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all rounded-sm shadow-lg disabled:opacity-50'
                            >
                                {loading ? (
                                    <Loader2 className='animate-spin' size={18} />
                                ) : (
                                    <>Send Login Code <ArrowRight size={14} /></>
                                )}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key='otp-step'
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={verifyOtp}
                            className='space-y-6'
                        >
                            <div className='space-y-2'>
                                <div className='flex justify-between items-end ml-1'>
                                    <label className='text-[11px] uppercase tracking-widest text-stone-500'>Enter 6-Digit Code</label>
                                    <button 
                                        type='button' 
                                        onClick={() => setStep('email')} 
                                        className='text-[9px] uppercase tracking-tighter text-orange-500 hover:underline'
                                    >
                                        Change Email
                                    </button>
                                </div>
                                <div className='relative'>
                                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-stone-300' size={18} />
                                    <input 
                                        ref={otpInputRef}
                                        type='text' 
                                        required
                                        maxLength={6}
                                        placeholder='0 0 0 0 0 0'
                                        className='w-full pl-10 pr-4 py-4 text-center text-xl tracking-[0.5em] font-bold border border-stone-100 bg-stone-50/30 rounded-sm outline-none focus:border-orange-400 transition-all text-gray-900'
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                                <p className='text-[10px] text-stone-400 text-center italic'>Verification code sent to {email}</p>
                            </div>

                            <div className='space-y-3'>
                                <button 
                                    disabled={loading}
                                    type='submit' 
                                    className='w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all rounded-sm shadow-lg disabled:opacity-50'
                                >
                                    {loading ? (
                                        <Loader2 className='animate-spin' size={18} />
                                    ) : (
                                        'Verify & Login'
                                    )}
                                </button>

                                <button 
                                    type='button'
                                    disabled={timer > 0 || loading}
                                    onClick={() => requestOtp()}
                                    className='w-full flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 hover:text-gray-900 transition-all disabled:opacity-30'
                                >
                                    {timer > 0 ? (
                                        `Resend code in ${timer}s`
                                    ) : (
                                        <><RefreshCcw size={12} /> Resend OTP Code</>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className='mt-12 text-center'>
                    <p className='text-[9px] uppercase tracking-[0.2em] text-stone-300'>Authorized Personnel Only</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;