import React from "react";
import { Quote, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    quote: "Peaceful experience...",
    content: "The divine atmosphere of the temple is truly unmatched. Every visit feels like a step closer to inner peace.",
    author: "Ramesh Kumar",
    location: "Mahalingpur",
  },
  {
    id: 2,
    quote: "Easy booking...",
    content: "The new digital pooja booking system is incredibly smooth. I could schedule my family's seva with just a few clicks.",
    author: "Sneha Patil",
    location: "Rabakavi",
  },
  {
    id: 3,
    quote: "Spiritual Heritage...",
    content: "As a devotee for 20 years, I'm amazed at how the Trust preserves our 150-year-old history while embracing modernity.",
    author: "Siddharth B.",
    location: "Banahatti",
  },
];

const Testimonials = () => {
  return (
    <section className="pt-10 pb-16 md:pt-14 md:pb-20 bg-transparent font-primary border-t border-stone-100">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-2.5">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] text-orange-600 font-bold block"
          >
            Devotee Stories
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-light text-stone-950 font-cinzel tracking-wide"
          >
            Voices of the Faithful
          </motion.h2>
          <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-4" aria-hidden="true"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-liquid-glass-card p-8 rounded-md hover:scale-[1.01] transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-[-15px] right-[-10px] text-stone-100/50 pointer-events-none" aria-hidden="true">
                <Quote size={90} />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex gap-1" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-orange-400 text-orange-400" />
                  ))}
                </div>

                <h3 className="text-md font-semibold font-cinzel text-stone-900 leading-snug tracking-wide">
                  "{t.quote}"
                </h3>
                
                <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed">
                  {t.content}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between border-t border-stone-100 pt-6 mt-6">
                <div>
                  <h4 className="text-xs font-bold text-stone-950 uppercase tracking-widest">{t.author}</h4>
                  <p className="text-[9px] text-stone-400 uppercase tracking-wider">{t.location}</p>
                </div>
                <Heart size={14} className="text-stone-200 group-hover:text-orange-500 group-hover:fill-orange-500 transition-colors" aria-hidden="true" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
