import React, { useContext, useEffect, useState } from 'react';
import Hero_img1 from '../assets/Hero_img1.jpg'
import Hero_img2 from '../assets/Hero_img2.jpg'
import Hero_img3 from '../assets/Hero_img3.jpg'
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
    <>
      <section className="relative rounded-sm overflow-hidden bg-gray-900 min-h-[30rem] lg:h-143">
        {/* Background Images Layer (Optimized for LCP) */}
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Divine temple heritage banner"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              currentImageIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              objectPosition: 'center 30%',
              // Only allow the first image to be the LCP candidate if it's the first render
            }}
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
            width="1920"
            height="1080"
          />
        ))}
        
        <div className="absolute inset-0 bg-gray-900/40 sm:bg-transparent sm:from-gray-900/80 sm:to-gray-900/10 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l rounded-sm"></div>

        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-143 lg:items-center lg:px-8 mb-10">
          <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h1 className="text-3xl font-extrabold sm:text-5xl text-primary">
              BANAHATTI-
              <span className="block uppercase text-4xl text-white mt-2">Temples Management Trust Committee</span>
            </h1>

            <p className="mt-4 max-w-lg sm:text-xl/relaxed text-gray-300">
              Experience the divine blessings at Kadasiddeshwar Temple. Join us in prayers and celebrations.
            </p>

            <div className="flex justify-center sm:justify-start">
              <div className="mt-8 flex flex-wrap gap-4 text-center">
                {token === localStorage.getItem('token') && (
                  <>
                    <Link
                      to="/temples"
                      className="group relative inline-flex items-center overflow-hidden rounded-sm px-5 md:px-10 py-3 text-primary border-primary border hover:text-white hover:bg-primary focus:outline-hidden"
                    >
                      <span className="absolute -end-full transition-all group-hover:end-4">
                        <svg
                          className="size-5 rtl:rotate-180"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            fillRule="evenodd"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                      <span className="font-medium transition-all group-hover:me-4">Book Pooja</span>
                    </Link>

                    <Link
                      to="/donation"
                      className="group relative inline-flex items-center overflow-hidden rounded-sm px-5 md:px-10 py-3 text-white border-white border hover:text-black hover:bg-white focus:outline-hidden"
                    >
                      <span className="absolute -end-full transition-all group-hover:end-4">
                        <svg
                          className="size-5 rtl:rotate-180"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            fillRule="evenodd"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                      <span className="font-medium transition-all group-hover:me-4">Donate Now</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image Slider Indicator Bars */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-6 rounded-full transition-all duration-300 ${
                currentImageIndex === index ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;