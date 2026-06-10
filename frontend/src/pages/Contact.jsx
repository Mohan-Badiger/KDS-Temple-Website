import React, { useContext, useState, useEffect } from 'react';
import { TempleContext } from '../context/TempleContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { MessageSquare, Bug, Send, Mail, MapPin, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
    const { token, backendUrl, settings } = useContext(TempleContext);
    const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'feedback'

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState('Improvement');
    const [feedbackMsg, setFeedbackMsg] = useState('');

    const [mapLoading, setMapLoading] = useState(true);
    const [loading, setLoading] = useState(false);

    // Autofill user details if logged in
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const response = await axiosInstance.get('/api/user/profile');
                    if (response.data.success) {
                        setName(response.data.user.name || '');
                        setEmail(response.data.user.email || '');
                    }
                } catch (error) {
                    console.error("Error fetching profile for autofill:", error);
                }
            } else {
                // Clear if logged out
                setName('');
                setEmail('');
            }
        };
        fetchUserProfile();
    }, [token, backendUrl]);

    const onContactSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/contact', { name, email, message });
            if (response.data.success) {
                toast.success(response.data.message);
                setMessage('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    const onFeedbackSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(backendUrl + '/api/feedback/submit', {
                name,
                email,
                type: feedbackType,
                message: feedbackMsg
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setFeedbackMsg('');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='font-primary min-h-screen py-12'>
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-light text-gray-900 uppercase tracking-widest mb-4">Get in Touch</h1>
                    <p className="text-stone-500 max-w-2xl mx-auto">We value your connection. Whether you have an inquiry or want to help us improve, we're here to listen.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side: Info & Map */}
                    <div className="lg:w-1/2 space-y-8">
                        <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100">
                            <h2 className="text-xl font-normal text-gray-900 mb-6 uppercase tracking-wider">Temple Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-sm">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Address</p>
                                        <p className="text-stone-500 text-sm">{settings?.address || "Kadasiddheshwar Temple, Banahatti, Karnataka 587311"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-sm">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Phone</p>
                                        <p className="text-stone-500 text-sm">{settings?.phone || "+91 98450 00000"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-sm">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Email</p>
                                        <p className="text-stone-500 text-sm">{settings?.email || "contact@banahattitemples.com"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="h-80 bg-stone-200 rounded-sm overflow-hidden relative shadow-sm border border-stone-100">
                            {mapLoading && (
                                <div className="absolute inset-0 z-10 bg-white/80 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.925928835828!2d75.12446747473987!3d16.47928788426119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc730c899a0dffb%3A0x61e2a5390925d9f!2sKadasiddheshwar%20Temple%20Banahatti!5e0!3m2!1sen!2sin!4v1740727319556!5m2!1sen!2sin"
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                                onLoad={() => setMapLoading(false)}
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Side: Tabbed Form */}
                    <div className="lg:w-1/2">
                        <div className="bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-stone-100">
                                <button
                                    onClick={() => setActiveTab('contact')}
                                    className={`flex-1 py-4 text-sm uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'contact' ? 'bg-orange-500 text-white' : 'text-stone-400 hover:text-orange-500 hover:bg-orange-50/30'}`}
                                >
                                    <MessageSquare size={16} /> Contact Us
                                </button>
                                <button
                                    onClick={() => setActiveTab('feedback')}
                                    className={`flex-1 py-4 text-sm uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'feedback' ? 'bg-orange-500 text-white' : 'text-stone-400 hover:text-orange-500 hover:bg-orange-50/30'}`}
                                >
                                    <Bug size={16} /> Improvements
                                </button>
                            </div>

                            <div className="p-8">
                                <AnimatePresence mode='wait'>
                                    {activeTab === 'contact' ? (
                                        <motion.form
                                            key="contact-form"
                                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            onSubmit={onContactSubmit} className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="block text-xs uppercase tracking-widest text-stone-500">Your Name</label>
                                                    <input
                                                        type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 focus:border-orange-500 outline-none transition-all text-sm rounded-sm"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-xs uppercase tracking-widest text-stone-500">Email Address</label>
                                                    <input
                                                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 focus:border-orange-500 outline-none transition-all text-sm rounded-sm"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs uppercase tracking-widest text-stone-500">Message</label>
                                                <textarea
                                                    rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required
                                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 focus:border-orange-500 outline-none transition-all text-sm rounded-sm resize-none"
                                                    placeholder="How can we help you?"
                                                ></textarea>
                                            </div>
                                            <button
                                                disabled={loading}
                                                className="w-full py-4 bg-gray-900 hover:bg-orange-500 text-white uppercase tracking-[0.2em] text-sm font-medium transition-all flex items-center justify-center gap-2 rounded-sm disabled:bg-stone-300"
                                            >
                                                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Send size={16} /> Send Message</>}
                                            </button>
                                        </motion.form>
                                    ) : (
                                        <motion.form
                                            key="feedback-form"
                                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            onSubmit={onFeedbackSubmit} className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="block text-xs uppercase tracking-widest text-stone-500">Your Name</label>
                                                    <input
                                                        type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 focus:border-orange-500 outline-none transition-all text-sm rounded-sm"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-xs uppercase tracking-widest text-stone-500">Email Address</label>
                                                    <input
                                                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-100 focus:border-orange-500 outline-none transition-all text-sm rounded-sm"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs uppercase tracking-widest text-stone-500">Feedback Type</label>
                                                <select
                                                    value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}
                                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 focus:border-orange-500 outline-none transition-all text-sm rounded-sm"
                                                >
                                                    <option value="Improvement">Improvement Suggestion</option>
                                                    <option value="Technical Issue">Technical Issue/Bug</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs uppercase tracking-widest text-stone-500">Details</label>
                                                <textarea
                                                    rows="5" value={feedbackMsg} onChange={(e) => setFeedbackMsg(e.target.value)} required
                                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-100 focus:border-orange-500 outline-none transition-all text-sm rounded-sm resize-none"
                                                    placeholder="Please describe the improvement or issue..."
                                                ></textarea>
                                            </div>
                                            <button
                                                disabled={loading}
                                                className="w-full py-4 bg-gray-900 hover:bg-orange-500 text-white uppercase tracking-[0.2em] text-sm font-medium transition-all flex items-center justify-center gap-2 rounded-sm disabled:bg-stone-300"
                                            >
                                                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Bug size={16} /> Submit Feedback</>}
                                            </button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
