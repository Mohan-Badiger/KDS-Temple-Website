import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import jatraDesktopImg from '../assets/Jatra-image.webp';
import jatraMobileImg from '../assets/jatra-image-mobile.webp';

const JatraPopup = () => {
  // Always open when user opens or refreshes the website
  const [isOpen, setIsOpen] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Prevent bottom/background website from scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalOverscroll = document.body.style.overscrollBehavior;

      // Lock scroll on both body and html
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';

      // Prevent wheel & touch scroll pass-through to background
      const preventBackgroundScroll = (e) => {
        e.preventDefault();
      };

      window.addEventListener('wheel', preventBackgroundScroll, { passive: false });
      window.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

      // Close on Escape key press
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overscrollBehavior = originalOverscroll;
        window.removeEventListener('wheel', preventBackgroundScroll);
        window.removeEventListener('touchmove', preventBackgroundScroll);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1500] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-md select-none touch-none overscroll-none"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Jatra Mahotsava Announcement"
        >
          {/* Popup Poster Frame - Sharp rectangular edges, premium shadow and gold aura */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 6 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative w-fit max-w-[94vw] sm:max-w-[88vw] md:max-w-4xl lg:max-w-5xl rounded-none border border-amber-500/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_rgba(227,140,0,0.22)] bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Icon INSIDE Top-Right Corner of the Image */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close announcement"
              title="Close"
              className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-30 group flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-black/90 active:scale-90 text-white/90 hover:text-amber-400 border border-white/30 hover:border-amber-400/80 shadow-2xl backdrop-blur-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:rotate-90 text-white group-hover:text-amber-300" />
            </button>

            {/* Poster Image - Sharp corners (rounded-none), high clarity, responsive picture */}
            <div className="relative overflow-hidden rounded-none min-w-[280px] min-h-[200px] flex items-center justify-center">
              {!imgLoaded && (
                <div className="absolute inset-0 bg-stone-900 animate-shimmer" />
              )}
              <picture className="block">
                {/* Mobile portrait image for small screens (<= 640px) */}
                <source media="(max-width: 640px)" srcSet={jatraMobileImg} type="image/webp" />
                {/* Desktop landscape image for larger screens (> 640px) */}
                <source media="(min-width: 641px)" srcSet={jatraDesktopImg} type="image/webp" />
                <img
                  src={jatraDesktopImg}
                  alt="Jatra Mahotsava Announcement"
                  className={`w-auto h-auto max-h-[82vh] sm:max-h-[85vh] max-w-[94vw] sm:max-w-[88vw] md:max-w-4xl lg:max-w-5xl object-contain block mx-auto rounded-none pointer-events-auto select-none transition-opacity duration-300 ${
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width="1280"
                  height="720"
                  onLoad={() => setImgLoaded(true)}
                />
              </picture>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JatraPopup;

