import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, Check } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const path = location.pathname;

  // Define booking flow steps
  const bookingSteps = [
    { name: 'Select Temple', path: '/temples' },
    { name: 'Select Pooja', path: '/pooja' },
    { name: 'Checkout', path: '/payment' },
    { name: 'Confirmed', path: '/booking-confirmation' }
  ];

  // Check if current page is part of the booking flow
  const currentBookingStepIdx = bookingSteps.findIndex(step => step.path === path);
  const isBookingFlow = currentBookingStepIdx !== -1;

  if (isBookingFlow) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 mt-10 mb-2">
        <div className="bg-liquid-glass-card rounded-md p-4 sm:p-5 flex items-center justify-between border border-white/60 shadow-sm select-none">
          <div className="flex w-full items-center justify-between">
            {bookingSteps.map((step, idx) => {
              const isCompleted = idx < currentBookingStepIdx;
              const isActive = idx === currentBookingStepIdx;
              const isUpcoming = idx > currentBookingStepIdx;

              return (
                <React.Fragment key={step.path}>
                  {/* Step Item */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 z-10">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 text-white shadow-md shadow-green-500/10'
                          : isActive
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                          : 'bg-white/40 border border-white/60 text-stone-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[9px] sm:text-xs uppercase tracking-[0.2em] font-bold transition-colors ${
                        isActive
                          ? 'text-orange-600 font-bold'
                          : isCompleted
                          ? 'text-stone-700 font-semibold'
                          : 'text-stone-400 font-semibold'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>

                  {/* Divider Line (not for last item) */}
                  {idx < bookingSteps.length - 1 && (
                    <div className="flex-grow mx-2 sm:mx-4 h-[2px] rounded-full hidden sm:block relative overflow-hidden bg-white/40">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                        style={{
                          width: isCompleted || (isActive && currentBookingStepIdx < idx) ? '100%' : '0%',
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Re-map custom names
  const segmentNames = {
    about: 'About Us',
    contact: 'Contact',
    gallery: 'Gallery',
    donation: 'Make Donation',
    profile: 'My Profile',
    settings: 'Settings',
    myseva: 'Seva History',
  };

  // Standard pages where breadcrumbs are appropriate (no full-screen banners, login screen excluded)
  const allowedStandardPaths = ['/gallery', '/contact', '/donation', '/profile', '/settings', '/myseva'];
  if (!allowedStandardPaths.includes(path)) return null;

  const segments = path.split('/').filter(Boolean);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-10 mb-2">
      <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/30 backdrop-blur-md border border-white/45 rounded-md text-xs shadow-sm select-none">
        <Link to="/" className="text-stone-500 hover:text-orange-600 flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline uppercase tracking-widest text-[9px] font-bold">Home</span>
        </Link>
        {segments.map((seg, idx) => {
          const currentUrl = `/${segments.slice(0, idx + 1).join('/')}`;
          const isLast = idx === segments.length - 1;
          const displayLabel = segmentNames[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);

          return (
            <React.Fragment key={currentUrl}>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              {isLast ? (
                <span className="text-orange-600 font-bold uppercase tracking-widest text-[9px]">
                  {displayLabel}
                </span>
              ) : (
                <Link to={currentUrl} className="text-stone-500 hover:text-orange-600 uppercase tracking-widest text-[9px] font-bold transition-colors">
                  {displayLabel}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumb;
