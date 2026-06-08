import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageWithSkeleton = ({ src, alt, className = '', imgClassName = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      
      {/* Devotional Shimmering Placeholder */}
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 animate-shimmer z-[5]"
          />
        )}
      </AnimatePresence>

      {/* Actual Image with smooth transition */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`transition-all duration-[750ms] ease-out ${imgClassName} ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
        }`}
        {...props}
      />
    </div>
  );
};

export default ImageWithSkeleton;
