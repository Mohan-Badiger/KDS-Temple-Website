import React, { useContext, useEffect, useState } from 'react';
import Hero_img1 from '../assets/Hero_img1.jpg';
import Hero_img2 from '../assets/Hero_img2.jpg';
import Hero_img3 from '../assets/Hero_img3.jpg';
import { Link } from 'react-router-dom';
import { TempleContext } from '../context/TempleContext';

const Hero = () => {
  const { token } = useContext(TempleContext);

  const images = [Hero_img1, Hero_img2, Hero_img3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative rounded-sm overflow-hidden bg-stone-900 min-h-[24rem] sm:min-h-[28rem] lg:min-h-[32rem] flex items-center w-full px-6 sm:px-10 lg:px-14">
      {/* Background Images Layer */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Divine temple heritage banner"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              currentImageIndex === index ? 'opacity-40' : 'opacity-0'
            }`}
            style={{ 
              objectPosition: 'center 35%',
            }}
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-stone-950/40 sm:bg-transparent sm:bg-gradient-to-r sm:from-stone-950/80 sm:to-stone-950/10 pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative w-full mx-auto max-w-7xl py-16 sm:py-20 lg:py-24 text-center sm:text-left z-10">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
            <span className="font-cinzel text-orange-400 block uppercase tracking-widest text-lg sm:text-xl font-bold mb-2">Banahatti</span>
            <span className="font-cinzel font-normal uppercase text-white tracking-wider text-2xl sm:text-4xl lg:text-5xl block">
              Temples Management Trust Committee
            </span>
          </h1>

          <p className="max-w-lg text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed font-light font-primary mx-auto sm:mx-0">
            Experience the divine blessings at Kadasiddheshwar Temple. Join us in prayers, online sevas, and sacred celebrations.
          </p>

          {/* Action CTAs */}
          {token === localStorage.getItem('token') && (
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 pt-4">
              <Link
                to="/temples"
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-md"
              >
                Book Pooja
              </Link>

              <Link
                to="/donation"
                className="w-full sm:w-auto text-center px-8 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/50 hover:border-white text-xs uppercase tracking-widest font-bold transition-all duration-300"
              >
                Donate Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Image Slider Indicator Bars */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2.5 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentImageIndex === index ? 'bg-orange-500 w-8' : 'bg-white/40 w-3 hover:bg-white/60'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;