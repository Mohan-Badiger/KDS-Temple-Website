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
    <section className="py-24 bg-stone-50/50 font-primary">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] text-orange-500 font-bold mb-4 block"
          >
            Devotee Stories
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight"
          >
            Voices of the <span className="font-medium">Faithful</span>
          </motion.h2>
          <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-6"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-white p-10 rounded-sm border border-stone-100 hover:border-orange-200 transition-all duration-500 group shadow-sm hover:shadow-md relative overflow-hidden"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-[-20px] right-[-10px] text-stone-50 group-hover:text-orange-50/50 transition-colors duration-500">
                <Quote size={120} />
              </div>

              <div className="relative z-10">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                  ))}
                </div>

                <h3 className="text-xl font-medium text-gray-900 mb-4 leading-relaxed">
                  "{t.quote}"
                </h3>
                
                <p className="text-stone-500 text-sm font-light leading-relaxed mb-8">
                  {t.content}
                </p>

                <div className="flex items-center justify-between border-t border-stone-50 pt-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{t.author}</h4>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">{t.location}</p>
                  </div>
                  <Heart size={16} className="text-stone-200 group-hover:text-orange-400 group-hover:fill-orange-400 transition-all duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
