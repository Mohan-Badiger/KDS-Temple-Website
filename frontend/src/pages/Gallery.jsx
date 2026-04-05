import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

// Image Imports
import image1 from '../assets/Gallery-01.jpg'
import image2 from '../assets/Gallery-02.jpg'
import image3 from '../assets/Gallery-03.jpg'
import image4 from '../assets/Gallery-04.jpg'
import image5 from '../assets/Gallery-05.jpg'
import image6 from '../assets/Gallery-06.jpg'
import image7 from '../assets/Gallery-07.jpg'
import image8 from '../assets/Gallery-08.jpg'
import image9 from '../assets/Gallery-09.jpg'
import image10 from '../assets/Gallery-10.jpg'
import photo from '../assets/photo.jpg'
import photo4 from '../assets/photo4.jpg'
import annaprasad from '../assets/annaprasad.jpg'

const groupedImages = [
    {
        title: "Temple Building",
        description: "Main structure and architecture of our temple.",
        photos: [
            { id: 1, src: image1, title: 'Main Temple', span: 'md:col-span-2 md:row-span-2' },
            { id: 5, src: image5, title: 'Temple View', span: 'md:col-span-1 md:row-span-1' },
            { id: 8, src: image8, title: 'Temple Entrance', span: 'md:col-span-1 md:row-span-1' },
            { id: 11, src: photo, title: 'Temple Morning', span: 'md:col-span-2 md:row-span-1' },
        ]
    },
    {
        title: "Morning Pooja",
        description: "Daily rituals and spiritual atmosphere.",
        photos: [
            { id: 9, src: image9, title: 'Pooja Ritual', span: 'md:col-span-1 md:row-span-1' },
            { id: 6, src: image6, title: 'Daily Prayer', span: 'md:col-span-1 md:row-span-1' },
            { id: 7, src: image7, title: 'Abhisheka', span: 'md:col-span-2 md:row-span-1' },
        ]
    },
    {
        title: "Festivals & Functions",
        description: "Celebrating our traditions together.",
        photos: [
            { id: 3, src: image3, title: 'Festival Decor', span: 'md:col-span-1 md:row-span-2' },
            { id: 2, src: image2, title: 'Temple Function', span: 'md:col-span-1 md:row-span-1' },
            { id: 12, src: photo4, title: 'Special Event', span: 'md:col-span-2 md:row-span-1' },
        ]
    },
    {
        title: "Temple Arts & Food",
        description: "Intricate carvings and sacred meals.",
        photos: [
            { id: 4, src: image4, title: 'Stone Carvings', span: 'md:col-span-1 md:row-span-1' },
            { id: 10, src: image10, title: 'Annaprasad', span: 'md:col-span-1 md:row-span-1' },
            { id: 13, src: annaprasad, title: 'Temple Kitchen', span: 'md:col-span-2 md:row-span-1' },
        ]
    }
];

// Flat list for easy lightbox navigation
const allPhotos = groupedImages.flatMap(group => group.photos);

const GalleryImage = ({ image, onClick, index }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            className={`relative group cursor-pointer overflow-hidden rounded-sm shadow-sm transition-all duration-500 bg-stone-100 ${image.span}`}
            onClick={() => onClick(image)}
        >
            {/* Skeleton */}
            <AnimatePresence mode='wait'>
                {!isLoaded && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center z-10"
                    >
                        <ImageIcon className="text-stone-300" size={32} />
                    </motion.div>
                )}
            </AnimatePresence>

            <img
                src={image.src}
                alt={image.title}
                loading="lazy"
                width={400}
                height={300}
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Corner Expand Button */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-2 rounded-sm text-white hover:bg-orange-500 transition-colors shadow-lg">
                    <Maximize2 size={16} />
                </div>
            </div>
        </motion.div>
    );
};

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const navigateImage = (direction) => {
        const currentIndex = allPhotos.findIndex(img => img.id === selectedImage.id);
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = allPhotos.length - 1;
        if (nextIndex >= allPhotos.length) nextIndex = 0;
        setSelectedImage(allPhotos[nextIndex]);
    };

    return (
        <div className="font-primary min-h-screen">
            <div className="container mx-auto px-4 py-20">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-flex items-center gap-3 mb-6"
                    >
                        <span className="w-12 h-[1px] bg-stone-200"></span>
                        <p className="text-[12px] uppercase tracking-[0.6em] text-orange-500 font-medium">Memory Wall</p>
                        <span className="w-12 h-[1px] bg-stone-200"></span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 uppercase mb-8"
                    >
                        Temple Photo Gallery
                    </motion.h1>
                    <div className="w-20 h-[2px] bg-orange-400 mx-auto mb-8"></div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-stone-500 font-light text-xl leading-relaxed max-w-2xl mx-auto"
                    >
                        Beautiful photos of our temple, morning poojas, rituals and festivals.
                    </motion.p>
                </div>

                {/* Grouped Sections */}
                {groupedImages.map((group, groupIdx) => (
                    <section key={groupIdx} className="mb-24 last:mb-0">
                        <div className="mb-10 text-start border-l-4 border-orange-400 pl-6">
                            <h2 className="text-3xl font-light tracking-tight text-gray-900 uppercase mb-2">{group.title}</h2>
                            <p className="text-stone-400 text-sm font-light uppercase tracking-widest">{group.description}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[280px]">
                            {group.photos.map((image, idx) => (
                                <GalleryImage
                                    key={image.id}
                                    image={image}
                                    index={idx}
                                    onClick={setSelectedImage}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Premium Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/98 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-10 p-2 bg-white/5 rounded-full"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                        >
                            <X size={32} />
                        </button>

                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                            <button
                                className="p-4 text-white/20 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                                onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
                            >
                                <ChevronLeft size={60} />
                            </button>
                        </div>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full h-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.src}
                                alt={selectedImage.title}
                                className="max-w-full max-h-full object-contain shadow-2xl"
                            />
                            <div className="absolute bottom-0 left-0 right-0 py-8 text-center bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="text-white text-2xl font-light tracking-[0.2em] uppercase">{selectedImage.title}</h3>
                            </div>
                        </motion.div>

                        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                            <button
                                className="p-4 text-white/20 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                                onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
                            >
                                <ChevronRight size={60} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;