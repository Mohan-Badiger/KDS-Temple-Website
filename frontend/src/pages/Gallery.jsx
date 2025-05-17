import React from 'react';
import image1 from '../assets/Gallery-01.jpg'
import image2 from '../assets/Gallery-02.jpg'
import image3 from '../assets/Gallery-03.jpg'
import image4 from '../assets/Gallery-04.jpg'
import image5 from '../assets/Gallery-05.jpg'
import image6 from '../assets/Gallery-06.jpg'
import image10 from '../assets/Gallery-10.jpg'
import image8 from '../assets/Gallery-08.jpg'
import image9 from '../assets/Gallery-09.jpg'

const Gallery = () => {
    return (
        <div className="font-primary">
      <div className="container mx-auto px-1 py-8">
        <h1 className="text-4xl font-bold text-start mb-8">Photo Gallery</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Large item */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-sm shadow-lg group">
            <img 
              src={image1} 
              alt="Temple" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-2xl font-bold text-white">Temple</h3>
                <p className="text-white">Discover the beauty of the our Temple</p>
              </div>
            </div>
          </div>
          
          {/* Other items */}
          {[
            { title: "", img: image9},
            { title: "", img: image2 },
            { title: "", img: image3 },
            { title: "", img: image4 },
            { title: "", img: image5 },
            { title: "", img: image6 },
            { title: "", img: image10 },
            { title: "", img: image8 }
          ].map((item, index) => (
            <div key={index} className="relative overflow-hidden rounded-sm shadow-lg group">
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-90 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-xl font-bold text-white">{item.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
};

export default Gallery;