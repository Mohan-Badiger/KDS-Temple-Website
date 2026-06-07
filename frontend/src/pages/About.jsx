import React from "react";
import Hero_img from "../assets/Hero_img.jpg";
import Accordion from "../components/Accordion";
import { accordionContent } from "../assets/accordionData.js";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="font-primary min-h-screen pt-6 sm:pt-8 flex flex-col gap-0 pb-12">
      {/* Hero Section - Immersive & Premium */}
      <section className="relative rounded-sm overflow-hidden bg-stone-900 min-h-[16rem] sm:min-h-[20rem] lg:min-h-[24rem] flex items-center justify-center w-full px-6 sm:px-10 lg:px-14">
        {/* Background Image Layer */}
        <div className="absolute inset-0">
          <img
            src={Hero_img}
            alt="Divine temple heritage banner"
            className="absolute inset-0 h-full w-full object-cover opacity-40 scale-105 transition-transform duration-[2000ms]"
            style={{ objectPosition: 'center 35%' }}
          />
          <div className="absolute inset-0 bg-stone-950/40 pointer-events-none"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-2xl mx-auto space-y-4"
          >
            <span className="text-[9px] uppercase tracking-[0.4em] text-orange-400 font-bold block mb-1">Divine Heritage</span>
            
            <h1 className="font-cinzel tracking-wider text-stone-200">
              <span className="block text-xs sm:text-sm md:text-base font-light uppercase tracking-[0.25em] mb-2">
                Experience the Divine Legacy of
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl font-semibold text-orange-400 uppercase tracking-widest leading-snug">
                Shri Kadasiddeshwar Temple
              </span>
            </h1>

            <p className="text-[10px] sm:text-xs md:text-sm text-stone-300 font-light tracking-wide max-w-lg mx-auto leading-relaxed border-t border-white/10 pt-4 italic font-primary">
              "A Sacred Haven of Faith and Tradition, standing tall for generations."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Clean & Informative */}
      <section className="py-12 md:py-16 bg-transparent border-t border-stone-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-12 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-orange-600 font-bold mb-2 block">Heritage & Lore</span>
            <h2 className="text-3xl md:text-4xl font-light text-stone-950 font-cinzel tracking-wide mb-4">
              Detailed History
            </h2>
            <div className="w-12 h-[1px] bg-stone-300 mx-auto"></div>
          </div>

          <div className="space-y-4">
            {accordionContent.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Accordion
                  title={item.title}
                  content={item.content}
                  bgClass={item.bgClass}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
