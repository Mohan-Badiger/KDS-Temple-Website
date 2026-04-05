import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Settings, Users, Calendar, Landmark, MapPin, ChevronRight, Globe } from 'lucide-react';

const AboutCard = () => {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const objectives = [
        {
            icon: <Settings className="text-orange-600" size={20} />,
            title: "Administration",
            desc: "Daily rituals, puja coordination, and overall temple operations management."
        },
        {
            icon: <ShieldCheck className="text-orange-600" size={20} />,
            title: "Preservation",
            desc: "Historical restoration and architectural upkeep of ancient temple structures."
        },
        {
            icon: <Calendar className="text-orange-600" size={20} />,
            title: "Festivals",
            desc: "Organizing grand Rathotsava, Shivaratri, and local cultural fairs with logistics."
        },
        {
            icon: <Users className="text-orange-600" size={20} />,
            title: "Community",
            desc: "Engaging with devotees for charitable activities and social welfare programs."
        }
    ];

    const temples = [
        { name: "Kadasiddheshwar", type: "Main Shiva Temple", icon: <Landmark size={18} /> },
        { name: "Veerabhadra Swamy", type: "Spiritual Hub", icon: <Landmark size={18} /> },
        { name: "Hanuman Temple", type: "Devotion & Strength", icon: <Landmark size={18} /> },
        { name: "Mallayya Temple", type: "Cultural Gathering", icon: <Landmark size={18} /> }
    ];

    return (
        <section className="w-full py-16 font-primary text-gray-900 border-t border-stone-100/50">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6"
                >
                    <div className="text-left max-w-2xl">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-orange-600 font-bold mb-3 block">Governance & Heritage</span>
                        <h2 className="text-3xl md:text-5xl font-light tracking-tight text-gray-900 mb-6 font-primary">Banahatti Temple <br className="hidden md:block" /> Management Trust</h2>
                        <p className="text-stone-500 text-sm md:text-base leading-relaxed">
                            A non-profit body dedicated to the spiritual, cultural, and architectural preservation of Banahatti's sacred landmarks. The Kadasiddheshwar Trust ensures the 150+ year legacy of our rituals continues to thrive for future generations.
                        </p>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Objectives: 2/3 Width */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {objectives.map((obj, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 bg-white border border-stone-100 rounded-sm hover:shadow-xl hover:shadow-stone-200/40 transition-all group"
                                >
                                    <div className="mb-4 p-3 bg-stone-50 w-fit rounded-sm group-hover:bg-orange-50 transition-colors">
                                        {obj.icon}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">{obj.title}</h3>
                                    <p className="text-sm text-stone-500 leading-relaxed font-light">{obj.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Temples List: 1/3 Width */}
                    <div className="space-y-6">
                        <div className="bg-stone-50 p-8 rounded-sm border border-stone-100">
                            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Administrated Temples</h3>
                            <div className="space-y-5">
                                {temples.map((temple, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className="p-2 text-stone-400 group-hover:text-orange-500 transition-colors">
                                            {temple.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-all">{temple.name}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-stone-400">{temple.type}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-stone-200">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="text-green-600 mt-1" size={14} />
                                    <p className="text-[11px] text-stone-500 leading-tight">Officially registered under the Hindu Religious Institutions and Charitable Endowments (Muzrai) Department.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Governance Summary (Readability focused) */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <div className="bg-white border-b-2 border-orange-200 p-4">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Governance</p>
                        <p className="text-sm font-medium text-gray-900 uppercase">Trust Board</p>
                    </div>
                    <div className="bg-white border-b-2 border-stone-100 p-4">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Founded</p>
                        <p className="text-sm font-medium text-gray-900 uppercase">Late 19th Century</p>
                    </div>
                    <div className="bg-white border-b-2 border-stone-100 p-4">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Status</p>
                        <p className="text-sm font-medium text-gray-900 uppercase">Public Charitable</p>
                    </div>
                    <div className="bg-white border-b-2 border-stone-100 p-4">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Location</p>
                        <p className="text-sm font-medium text-gray-900 uppercase">Rabkavi-Banahatti</p>
                    </div>
                </motion.div>

                {/* Call To Action */}
                <div className="mt-12 flex justify-center">
                    <Link 
                        to='/about' 
                        onClick={handleClick}
                        className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-none uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-orange-600 transition-all duration-500 shadow-xl shadow-stone-200/50"
                    >
                        Learn About Legacy <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutCard;