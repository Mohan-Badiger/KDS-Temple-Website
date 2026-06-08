import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Heart, Calendar, Landmark, ChevronRight } from 'lucide-react';

const AboutCard = () => {


    const pillars = [
        {
            icon: <Sparkles className="text-orange-500" size={16} />,
            title: "Daily Worship (Sevas)",
            desc: "Conducting traditional prayers, pujas, and abhishekams every day with pure devotion."
        },
        {
            icon: <Heart className="text-orange-500" size={16} />,
            title: "Heritage Care (Maintenance)",
            desc: "Caring for our historic temple structures and preserving their beautiful architecture."
        },
        {
            icon: <Calendar className="text-orange-500" size={16} />,
            title: "Joyful Festivals (Utsavas)",
            desc: "Organizing the grand annual Rathotsava (Chariot Festival) and major celebrations like Maha Shivaratri."
        },
        {
            icon: <Heart className="text-orange-500" size={16} />,
            title: "Helping Hand (Charity)",
            desc: "Running food donation programs and supporting community welfare initiatives for all."
        }
    ];

    const shrines = [
        {
            name: "Shri Kadasiddeshwar Temple",
            desc: "The main temple of Lord Shiva, a source of peace and blessings for generations.",
            icon: <Landmark size={18} />
        },
        {
            name: "Shri Veerabhadra Swamy Temple",
            desc: "A sacred center of protection, strength, and local spiritual heritage.",
            icon: <Landmark size={18} />
        },
        {
            name: "Shri Hanuman Temple",
            desc: "The temple of courage and devotion, located in the lively Mangalvar Peth.",
            icon: <Landmark size={18} />
        },
        {
            name: "Shri Mallikarjuna Temple",
            desc: "A peaceful local sanctuary dedicated to Lord Shiva, beloved by rural devotees.",
            icon: <Landmark size={18} />
        }
    ];

    return (
        <section className="w-full pt-16 pb-10 md:pt-20 md:pb-14 font-primary text-stone-900 border-t border-stone-100 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center md:text-left"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] text-orange-600 font-bold mb-2.5 block">Sacred Legacy</span>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight text-stone-950 font-cinzel leading-tight">
                        Banahatti Temples Trust
                    </h2>
                    <p className="mt-4 text-stone-500 text-sm md:text-base leading-relaxed max-w-3xl font-light">
                        For over 150 years, the Banahatti Temples Trust has served as the humble caretaker of our town's ancient sanctuaries. Our committee works with devotion to keep our sacred traditions alive, coordinate daily worships, and serve the community under the guidance of the Muzrai Department.
                    </p>
                </motion.div>

                {/* Main Content Grid: Left (Shrines) 2/3, Right (Pillars) 1/3 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    
                    {/* Left Side: Shrines (8 cols on lg) */}
                    <div className="lg:col-span-8 space-y-6">
                        <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-400 mb-2">Sacred Shrines Under Our Care</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {shrines.map((shrine, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 bg-stone-50/50 border border-stone-200/60 rounded-sm hover:shadow-md hover:border-orange-500/20 transition-all duration-300 group"
                                >
                                    <div className="mb-4 p-3 bg-stone-100 rounded-sm w-fit group-hover:bg-orange-50 transition-colors">
                                        {shrine.icon}
                                    </div>
                                    <h4 className="text-md font-semibold font-cinzel text-stone-900 mb-2 tracking-wide group-hover:text-orange-600 transition-colors">{shrine.name}</h4>
                                    <p className="text-xs text-stone-500 leading-relaxed font-light">{shrine.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
    
                    {/* Right Side: Pillars of Service (4 cols on lg) */}
                    <div className="lg:col-span-4">
                        <div className="bg-stone-50 border border-stone-200/60 p-6 sm:p-8 rounded-sm space-y-6">
                            <h3 className="text-[10px] uppercase tracking-[0.25em] font-bold text-stone-400">Our Pillars of Service</h3>
                            <div className="space-y-6">
                                {pillars.map((pillar, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: 15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-4 group"
                                    >
                                        <div className="p-2 bg-stone-100 rounded-sm text-stone-400 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all shrink-0">
                                            {pillar.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold font-cinzel text-stone-900 group-hover:text-orange-500 transition-colors tracking-wide">{pillar.title}</p>
                                            <p className="text-[10px] text-stone-500 font-light mt-1 leading-relaxed">{pillar.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="pt-6 border-t border-stone-200 flex items-start gap-2.5">
                                <ShieldCheck className="text-green-600 mt-0.5 shrink-0" size={14} />
                                <p className="text-[10px] text-stone-500 leading-normal font-light">
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
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Caretaker</p>
                        <p className="text-xs font-bold text-stone-900 uppercase font-cinzel tracking-wider">Trust Board</p>
                    </div>
                    <div className="bg-stone-50/50 border border-stone-100 p-4 rounded-sm text-center md:text-left">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Legacy</p>
                        <p className="text-xs font-bold text-stone-900 uppercase font-cinzel tracking-wider">150+ Years of Service</p>
                    </div>
                    <div className="bg-stone-50/50 border border-stone-100 p-4 rounded-sm text-center md:text-left">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Status</p>
                        <p className="text-xs font-bold text-stone-900 uppercase font-cinzel tracking-wider">Registered Muzrai Trust</p>
                    </div>
                    <div className="bg-stone-50/50 border border-stone-100 p-4 rounded-sm text-center md:text-left">
                        <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Area</p>
                        <p className="text-xs font-bold text-stone-900 uppercase font-cinzel tracking-wider">Rabkavi-Banahatti</p>
                    </div>
                </motion.div>


            </div>
        </section>
    );
};

export default AboutCard;