import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Landmark, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white text-gray-900 font-primary pt-20 pb-10 border-t border-stone-100">
            <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-7xl">
                {/* Main Content Grid - Balanced Two-Column Structure */}
                <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-24 mb-20">
                    
                    {/* Brand & Mission (Structured Left) */}
                    <div className="lg:w-5/12">
                        <div className="mb-8">
                            <h2 className="text-xl sm:text-2xl font-bold leading-tight uppercase tracking-[0.1em] text-gray-900 border-l-4 border-orange-400 pl-4">
                                Banahatti <br />
                                Temples Management <br />
                                Trust Committee
                            </h2>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed font-light text-stone-500 max-w-md">
                            Preserving the 150-year-old architectural and spiritual heritage of Banahatti through dedicated service and community welfare.
                        </p>
                    </div>

                    {/* Links & Connectivity (Structured Right) */}
                    <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 lg:gap-12">
                        {/* Sacred Services */}
                        <div>
                            <h4 className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-8">Sacred Services</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li>
                                    <Link to="/pooja" onClick={handleScrollTop} className="text-stone-600 hover:text-orange-500 transition-colors duration-300">E-Pooja Booking</Link>
                                </li>
                                <li>
                                    <Link to="/donation" onClick={handleScrollTop} className="text-stone-600 hover:text-orange-500 transition-colors duration-300">Annasantoor</Link>
                                </li>
                                <li>
                                    <Link to="/gallery" onClick={handleScrollTop} className="text-stone-600 hover:text-orange-500 transition-colors duration-300">Divine Gallery</Link>
                                </li>
                            </ul>
                        </div>

                        {/* The Heritage */}
                        <div>
                            <h4 className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-8">The Heritage</h4>
                            <ul className="space-y-4 text-sm font-medium">
                                <li>
                                    <Link to="/about" onClick={handleScrollTop} className="text-stone-600 hover:text-orange-500 transition-colors duration-300">About Trust</Link>
                                </li>
                                <li>
                                    <Link to="/contact" onClick={handleScrollTop} className="text-stone-600 hover:text-orange-500 transition-colors duration-300">Contact Us</Link>
                                </li>
                                <li>
                                    <Link to="/profile" onClick={handleScrollTop} className="text-stone-600 hover:text-orange-400 transition-colors duration-300 font-semibold underline decoration-orange-400/20 underline-offset-4">My Dashboard</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Connectivity */}
                        <div>
                            <h4 className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-8">Connectivity</h4>
                            <div className="space-y-6 text-[13px] font-medium">
                                <div className="flex gap-4">
                                    <MapPin size={16} className="text-orange-400 shrink-0 mt-1" aria-hidden="true" />
                                    <p className="leading-snug text-stone-600">
                                        SH 53, Rabkavi Banhatti, <br />
                                        Bagalkot, Karnataka 587311.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-stone-600">
                                    <Phone size={16} className="text-orange-400 shrink-0" aria-hidden="true" />
                                    <p>+91 91234 56789</p>
                                </div>
                                <div className="flex items-center gap-4 text-stone-600">
                                    <Mail size={16} className="text-orange-400 shrink-0" aria-hidden="true" />
                                    <p className="truncate">info@banahattitemple.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom Bar */}
                <div className="pt-10 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-light">
                        © {new Date().getFullYear()} Shri Kadasiddheshwar Temple Trust • Banahatti
                    </p>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-400 font-light translate-y-[-1px]">
                        Built with <Heart size={10} className="text-orange-400 fill-orange-400" aria-hidden="true" /> for the Community
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;