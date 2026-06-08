import React from 'react';
import { motion } from 'framer-motion';
import om_logo from '../../assets/om.png';

const DevotionalLoader = ({ fullScreen = false }) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center font-primary select-none transition-all duration-500 ${
        fullScreen 
          ? 'fixed inset-0 z-[200] bg-stone-950/80 backdrop-blur-md' 
          : 'w-full py-16 min-h-[40vh] bg-transparent'
      }`}
    >
      <div className="relative flex flex-col items-center">
        
        {/* Soft Radial Golden Glow */}
        <div className="absolute w-36 h-36 rounded-full bg-orange-500/10 blur-2xl -top-6 animate-pulse"></div>

        {/* Golden Rotating Mandala/Circular Ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 border-[2px] border-orange-500/10 rounded-full"></div>
          
          {/* Animated Golden Stroke Spinner */}
          <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E38C00" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E38C00" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              stroke="url(#gold-grad)" 
              strokeWidth="2.5" 
              fill="none" 
              strokeDasharray="180 120"
              strokeLinecap="round"
            />
          </svg>

          {/* Central Pulsing Sacred Om Icon */}
          <motion.div
            animate={{ 
              scale: [0.94, 1.06, 0.94],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-stone-900/5 backdrop-blur-sm shadow-inner"
          >
            <img 
              src={om_logo} 
              alt="Om" 
              className="w-8 h-8 object-contain filter drop-shadow-[0_0_8px_rgba(227,140,0,0.4)]"
            />
          </motion.div>
        </div>

        {/* Serif Devotional Text */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center space-y-1.5"
        >
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.25em] text-orange-400 font-semibold uppercase animate-pulse">
            Connecting to Sacred Heritage
          </p>
          <p className="text-[10px] sm:text-[11px] tracking-widest text-stone-400 font-light italic">
            Please wait while the temple gates open...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DevotionalLoader;
