import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="font-primary min-h-[70vh] flex items-center justify-center bg-transparent px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md text-center flex flex-col items-center"
      >
        <h1 className="text-8xl font-light text-stone-300 tracking-wider mb-2 select-none">
          404
        </h1>
        
        <h2 className="font-cinzel text-xl sm:text-2xl text-gray-900 tracking-wide uppercase mb-4">
          Page Not Found
        </h2>
        
        <p className="text-xs sm:text-sm text-stone-500 max-w-xs mb-8 leading-relaxed uppercase tracking-widest">
          The page you are looking for does not exist or has been moved.
        </p>

        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs uppercase tracking-widest px-8 py-4 rounded-md shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          Go to Home
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
