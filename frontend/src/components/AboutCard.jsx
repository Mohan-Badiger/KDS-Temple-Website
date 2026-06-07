import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Settings, Users, Calendar, Landmark, ChevronRight } from 'lucide-react';

const AboutCard = () => {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const objectives = [
        {
            icon: <Settings className="text-orange-500" size={20} />,
            title: "Administration",
            desc: "Daily rituals, puja coordination, and overall temple operations management."
        },
        {
            icon: <ShieldCheck className="text-orange-500" size={20} />,
            title: "Preservation",
            desc: "Historical restoration and architectural upkeep of ancient temple structures."
        },
        {
            icon: <Calendar className="text-orange-500" size={20} />,
            title: "Festivals",
            desc: "Organizing grand Rathotsava, Shivaratri, and local cultural fairs with logistics."
        },
        {
            icon: <Users className="text-orange-500" size={20} />,
            title: "Community",
            desc: "Engaging with devotees for charitable activities and social welfare programs."
        }
    ];

    const temples = [
        { name: "Kadasiddheshwar", type: "Main Shiva Temple", icon: <Landmark size={16} /> },
        { name: "Veerabhadra Swamy", type: "Spiritual Hub", icon: <Landmark size={16} /> },
        { name: "Hanuman Temple", type: "Devotion & Strength", icon: <Landmark size={16} /> },
        { name: "Mallayya Temple", type: "Cultural Gathering", icon: <Landmark size={16} /> }
    ];

    return (
        <section className="w-full pt-12 pb-6 md:pt-16 md:pb-8 font-primary text-stone-900 border-t border-stone-100 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center md:text-left"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-orange-600 font-bold mb-2.5 block">Governance & Heritage</span>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight text-stone-950 font-cinzel leading-tight">
                        Banahatti Temple <br className="hidden md:block" /> Management Trust
                    </h2>
                    <p className="mt-4 text-stone-500 text-sm md:text-base leading-relaxed max-w-3xl">
                        A non-profit body dedicated to the spiritual, cultural, and architectural preservation of Banahatti's sacred landmarks. The Kadasiddheshwar Trust ensures the 150+ year legacy of our rituals continues to thrive for future generations.
                    </p>
                </motion.div>

                {/* Main Content Grid: 2/3 and 1/3 layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    
                    {/* Left Grid (Objectives): 2/3 Width */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {objectives.map((obj, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 bg-stone-50/50 border border-stone-200/60 rounded-sm hover:shadow-md hover:border-orange-500/20 transition-all duration-300 group"
                                >
                                    <div className="mb-4 p-3 bg-stone-100 rounded-sm w-fit group-hover:bg-orange-50 transition-colors">
                                        {obj.icon}
                                    </div>
                                    <h3 className="text-md font-semibold font-cinzel text-stone-900 mb-2 tracking-wide">{obj.title}</h3>
                                    <p className="text-xs text-stone-500 leading-relaxed font-light">{obj.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
    
                    {/* Right Grid (Administrated Temples): 1/3 Width */}
                    <div className="lg:col-span-4">
                        <div className="bg-stone-50 border border-stone-200/60 p-6 sm:p-8 rounded-sm space-y-6">
                            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-400">Administrated Shrines</h3>
                            <div className="space-y-5">
                                {temples.map((temple, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: 15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className="p-2 text-stone-400 group-hover:text-orange-500 transition-colors">
                                            {temple.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold font-cinzel text-stone-900 group-hover:text-orange-500 transition-colors tracking-wide">{temple.name}</p>
                                            <p className="text-[9px] uppercase tracking-widest text-stone-400">{temple.type}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="pt-6 border-t border-stone-200 flex items-start gap-2.5">
                                <ShieldCheck className="text-green-600 mt-0.5 shrink-0" size={14} />
                                <p className="text-[10px] text-stone-500 leading-normal">
                                    Officially registered and administered under the Hindu Religious Institutions and Charitable Endowments (Muzrai) Department.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Governance Summary Footer row */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-stone-100 pt-8"
                >
                    <div className="bg-stone-50/50 border border-stone-100 p-4 rounded-sm text-center md:text-left">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Governance</p>
                        <p className="text-xs font-bold text-stone-900 uppercase font-cinzel tracking-wider">Trust Board</p>
                    </div>
                    <div className="bg-stone-50/50 border border-stone-100 p-4 rounded-sm text-center md:text-left">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Founded</p>
                        <p className="text-xs font-bold text-stone-900 uppercase font-cinzel tracking-wider">Late 19th Century</p>
                    </div>
                    <div className="bg-stone-50/50 border border-stone-100 p-4 rounded-sm text-center md:text-left">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Status</p>
                        <p className="text-xs font-bold text-stone-900 uppercase font-cinzel tracking-wider">Public Charitable</p>
                    </div>
                    <div className="bg-stone-50/50 border border-stone-100 p-4 rounded-sm text-center md:text-left">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Location</p>
                        <p className="text-xs font-bold text-stone-900 uppercase font-cinzel tracking-wider">Rabkavi-Banahatti</p>
                    </div>
                </motion.div>

                {/* Call To Action */}
                <div className="mt-12 flex justify-center">
                    <Link 
                        to='/about' 
                        onClick={handleClick}
                        className="group flex items-center gap-2.5 px-8 py-3.5 bg-stone-950 text-white rounded-none uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-orange-600 transition-all duration-300 shadow-md border border-transparent"
                    >
                        <span>Learn About Legacy</span>
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutCard;