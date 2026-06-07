import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Landmark, Heart, Compass } from 'lucide-react';
import om_logo from '../assets/om.png';

const Footer = () => {
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-stone-950 text-white font-primary pt-24 pb-12 border-t border-orange-500/20 px-4 -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] sm:px-[5vw] md:px-[7vw] lg:px-[9vw] relative overflow-hidden">
            {/* Background Subtle Divine Mandalas / Elements */}
            <div className="absolute -left-24 -bottom-24 text-white/[0.01] pointer-events-none" aria-hidden="true">
                <Landmark size={300} />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Main Content Grid - Balanced Two-Column Structure */}
                <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-20">

                    {/* Brand & Mission (Structured Left) */}
                    <div className="lg:w-5/12 space-y-6">
                        <div className="flex items-center gap-3">
                            <img src={om_logo} alt="Om" className="h-9 w-9 object-contain filter brightness-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                            <div className="flex flex-col">
                                <h2 className="text-lg sm:text-xl font-bold tracking-widest text-gold font-cinzel leading-tight uppercase">
                                    BNT TEMPLES
                                </h2>
                                <span className="text-[7px] uppercase tracking-[0.3em] text-orange-400 font-bold">Trust Committee</span>
                            </div>
                        </div>
                        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-light max-w-md">
                            Preserving the 150-year-old architectural and spiritual heritage of Banahatti through dedicated governance, gaushala support, daily Annaprasad sevas, and global devotee engagement.
                        </p>
                    </div>

                    {/* Links & Connectivity (Structured Right) */}
                    <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
                        {/* Sacred Services */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] uppercase tracking-[0.35em] text-orange-400 font-bold">Sacred Services</h4>
                            <ul className="space-y-4 text-xs font-semibold">
                                <li>
                                    <Link to="/temples" onClick={handleScrollTop} className="text-stone-300 hover:text-orange-400 transition-colors duration-300 tracking-wider">E-Pooja Booking</Link>
                                </li>
                                <li>
                                    <Link to="/donation" onClick={handleScrollTop} className="text-stone-300 hover:text-orange-400 transition-colors duration-300 tracking-wider">Dana Offering</Link>
                                </li>
                                <li>
                                    <Link to="/gallery" onClick={handleScrollTop} className="text-stone-300 hover:text-orange-400 transition-colors duration-300 tracking-wider">Divine Gallery</Link>
                                </li>
                            </ul>
                        </div>

                        {/* The Heritage */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] uppercase tracking-[0.35em] text-orange-400 font-bold">The Heritage</h4>
                            <ul className="space-y-4 text-xs font-semibold">
                                <li>
                                    <Link to="/about" onClick={handleScrollTop} className="text-stone-300 hover:text-orange-400 transition-colors duration-300 tracking-wider">About Trust</Link>
                                </li>
                                <li>
                                    <Link to="/contact" onClick={handleScrollTop} className="text-stone-300 hover:text-orange-400 transition-colors duration-300 tracking-wider">Contact Us</Link>
                                </li>
                                <li>
                                    <Link to="/profile" onClick={handleScrollTop} className="text-orange-400 hover:text-orange-300 transition-colors duration-300 tracking-wider font-bold decoration-orange-400/20 underline-offset-4">My Dashboard</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Connectivity */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] uppercase tracking-[0.35em] text-orange-400 font-bold">Connectivity</h4>
                            <div className="space-y-5 text-xs font-semibold">
                                <div className="flex gap-3.5 items-start">
                                    <MapPin size={14} className="text-orange-400 shrink-0 mt-0.5" aria-hidden="true" />
                                    <p className="leading-relaxed text-stone-300">
                                        SH 53, Rabkavi Banhatti, <br />
                                        Bagalkot, Karnataka 587311.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3.5 text-stone-300">
                                    <Phone size={14} className="text-orange-400 shrink-0" aria-hidden="true" />
                                    <p>+91 91234 56789</p>
                                </div>
                                <div className="flex items-center gap-3.5 text-stone-300">
                                    <Mail size={14} className="text-orange-400 shrink-0" aria-hidden="true" />
                                    <p className="truncate">info@banahattitemple.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-medium">
                        © {new Date().getFullYear()} Shri Kadasiddheshwar Temple Trust • Banahatti. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-stone-500 font-medium">
                        Crafted with <Heart size={10} className="text-orange-500 fill-orange-500" aria-hidden="true" /> for the community
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;