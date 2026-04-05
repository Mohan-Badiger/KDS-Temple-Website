import React from "react";
import Hero_img from "../assets/Hero_img.jpg";
import Accordion from "../components/Accordion";
import { accordionContent } from "../assets/accordionData.js";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="font-primary min-h-screen">
      {/* Hero Section - Immersive & Premium */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${Hero_img})` }}
        >
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-orange-400 font-bold mb-6 block">Divine Heritage</span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl text-white font-light leading-tight mb-8 drop-shadow-2xl">
              Experience the Divine Legacy of <br />
              <span className="font-medium text-orange-50">Shri Kadasiddeshwar Temple</span>
            </h1>
            <p className="text-gray-200 text-sm md:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed border-t border-white/20 pt-8 italic">
              "A Sacred Haven of Faith and Tradition, standing tall for generations."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Clean & Informative */}
      <section className="py-20 bg-stone-50/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-sm uppercase tracking-[0.3em] text-stone-400 font-bold mb-2">Detailed History</h2>
            <div className="w-12 h-[2px] bg-orange-500 mx-auto"></div>
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
