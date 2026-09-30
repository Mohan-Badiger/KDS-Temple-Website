import React from 'react';
import { PhoneCall } from 'lucide-react';

const WebDevPromo = () => {
  const phoneNumber = '+91 6362893798';
  const rawPhoneNumber = '916362893798';
  const whatsappUrl = `https://wa.me/${rawPhoneNumber}?text=Hello!%20I%20am%20interested%20in%20building%20a%20website%20for%20my%20business.%20Please%20share%20details.`;

  const categories = [
    'Shops & E-Commerce',
    'Temples & Trusts',
    'Restaurants & Cafes',
    'Clinics & Hospitals',
    'Companies & Startups',
    'Schools & Colleges',
    'Real Estate & Builders',
    'Personal Portfolios',
  ];

  return (
    <section className="my-10 font-primary">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white border border-amber-500/30 p-7 sm:p-9 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65),0_0_30px_rgba(234,88,12,0.08)]">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left: Heading, Description & Structured 2-Column Categories */}
          <div className="space-y-5 lg:max-w-2xl">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-light text-stone-100 tracking-wide leading-tight">
                Need a Website for <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500">Your Business?</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-stone-300/90 font-light leading-relaxed">
                We build fast, secure, and modern websites tailored across all categories:
              </p>
            </div>

            {/* Categories Side by Side with Background, No Bullet Points */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
              {categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-800/80 text-stone-200 hover:text-amber-300 hover:bg-stone-750 text-xs sm:text-sm font-medium transition-colors cursor-default shadow-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Action Buttons Side by Side + Trust Details */}
          <div className="flex flex-col items-start lg:items-end gap-4 shrink-0 pt-2 lg:pt-0">
            
            <div className="flex flex-row flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_10px_25px_-5px_rgba(16,185,129,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.5)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                aria-label="Chat on WhatsApp"
              >
                <svg className="w-5 h-5 fill-current shrink-0 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp: {phoneNumber}</span>
              </a>

              {/* Direct Call Button */}
              <a
                href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl bg-stone-900/90 hover:bg-stone-850 border border-stone-700/80 hover:border-amber-500/50 text-stone-200 hover:text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>Call: {phoneNumber}</span>
              </a>
            </div>

            {/* Micro Trust Details */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400 font-light">
              <span>⚡ Fast 3-7 Days Delivery</span>
              <span className="text-stone-600">•</span>
              <span>100% Mobile Ready</span>
              <span className="text-stone-600">•</span>
              <span>Free Consultation</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default WebDevPromo;
