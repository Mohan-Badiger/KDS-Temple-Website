import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageWithSkeleton = ({ 
  src, 
  alt = '', 
  className = '', 
  imgClassName = '', 
  loading = 'lazy',
  decoding = 'async',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Instant display if image is already cached in browser
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      {/* Devotional Shimmering Placeholder */}
      <AnimatePresence mode="wait">
        {!isLoaded && !hasError && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 animate-shimmer z-[5]"
          />
        )}
      </AnimatePresence>

      {/* Actual Image with hardware-accelerated smooth transition */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`transition-all duration-500 ease-out will-change-transform ${imgClassName} ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
        }`}
        {...props}
      />
    </div>
  );
};

export default ImageWithSkeleton;

