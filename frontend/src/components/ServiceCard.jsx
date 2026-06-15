import React, { useContext } from 'react';
import seva from '/seva.svg';
import donate from '/donate.png';
import myseva from '/myseva.png';
import { TempleContext } from '../context/TempleContext';
import { toast } from 'react-toastify';
import { ChevronRight } from 'lucide-react';

const ServiceCard = () => {
    const { token, navigate } = useContext(TempleContext);

    const poojaClickHandler = () => {
        if (token || localStorage.getItem('token')) {
            navigate('/temples');
        } else {
            navigate('/login', { state: { from: '/temples' } });
        }
    };
    const donationClickHandler = () => {
        if (token || localStorage.getItem('token')) {
            navigate('/donation');
        } else {
            navigate('/login', { state: { from: '/donation' } });
        }
    };

    const annaprasadClickHandler = () => {
        if (token || localStorage.getItem('token')) {
            navigate('/myseva');
        } else {
            navigate('/login', { state: { from: '/myseva' } });
        }
    };

    return (
        <section className="w-full pt-10 pb-10 md:pt-14 md:pb-14 font-primary text-stone-900 border-t border-stone-100">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header */}
                <div className="text-center mb-16 space-y-3">
                    <h2 className="text-3xl md:text-5xl font-light text-stone-950 font-cinzel tracking-wide">
                        E-Services
                    </h2>
                    <p className="text-stone-500 text-sm max-w-lg mx-auto font-light leading-relaxed">
                        Divine E-Services – Connecting You to Spiritual Bliss with Ease!
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">

                    {/* Pooja Card */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-4 p-6 bg-stone-50/40 border border-stone-100 rounded-sm hover:shadow-md hover:border-orange-500/15 transition-all duration-300">
                        <div className="bg-indigo-100 rounded-full w-14 h-14 flex justify-center items-center text-indigo-500 shadow-lg shrink-0">
                            <img src={seva} alt="Seva Pooja" className="w-8 h-8 object-contain" />
                        </div>
                        <h3 className="uppercase text-lg font-semibold font-cinzel text-stone-900 tracking-wider">
                            Pooja's
                        </h3>
                        <p className="text-xs text-stone-500 leading-relaxed font-light">
                            The Pooja Module enables devotees to seamlessly book poojas like Abhishek, Kumkum Pooja, Belli Pooja, and Butti Pooja online, ensuring a hassle-free and spiritually fulfilling experience.
                        </p>
                        <button
                            className="text-indigo-600 flex items-center gap-1.5 hover:text-indigo-800 font-semibold text-xs tracking-wider uppercase cursor-pointer pt-2 group"
                            onClick={poojaClickHandler}
                        >
                            <span>Book Pooja</span>
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    {/* Donation Card */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-4 p-6 bg-stone-50/40 border border-stone-100 rounded-sm hover:shadow-md hover:border-orange-500/15 transition-all duration-300">
                        <div className="bg-red-100 rounded-full w-14 h-14 flex justify-center items-center text-red-500 shadow-lg shrink-0">
                            <img src={donate} alt="Donation" className="w-8 h-8 object-contain" />
                        </div>
                        <h3 className="uppercase text-lg font-semibold font-cinzel text-stone-900 tracking-wider">
                            Donations
                        </h3>
                        <p className="text-xs text-stone-500 leading-relaxed font-light">
                            The Donation Module provides a secure and transparent platform for devotees to contribute towards temple development, renovations, and maintenance, ensuring the preservation of spiritual and cultural heritage.
                        </p>
                        <button
                            className="text-red-600 flex items-center gap-1.5 hover:text-red-800 font-semibold text-xs tracking-wider uppercase cursor-pointer pt-2 group"
                            onClick={donationClickHandler}
                        >
                            <span>Donate Now</span>
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    {/* My Seva Card */}
                    <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-4 p-6 bg-stone-50/40 border border-stone-100 rounded-sm hover:shadow-md hover:border-orange-500/15 transition-all duration-300">
                        <div className="bg-green-100 rounded-full w-14 h-14 flex justify-center items-center text-green-500 shadow-lg shrink-0">
                            <img src={myseva} alt="My Seva" className="w-8 h-8 object-contain" />
                        </div>
                        <h3 className="uppercase text-lg font-semibold font-cinzel text-stone-900 tracking-wider">
                            My Seva
                        </h3>
                        <p className="text-xs text-stone-500 leading-relaxed font-light">
                            Track your spiritual journey and contributions. This section allows you to view your pooja bookings and manage your donations, providing a complete record of your temple activities in one place.
                        </p>
                        <button
                            className="text-green-600 flex items-center gap-1.5 hover:text-green-800 font-semibold text-xs tracking-wider uppercase cursor-pointer pt-2 group"
                            onClick={annaprasadClickHandler}
                        >
                            <span>My Seva's</span>
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ServiceCard;