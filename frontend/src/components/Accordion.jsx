import React, { useState } from "react";
import { ChevronDown, Globe, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("english");

  return (
    <div className="w-full bg-white mb-4 border border-stone-200/60 rounded-sm hover:border-orange-500/20 hover:shadow-md transition-all duration-300">
      <div className="w-full">
        {/* Accordion header - Premium & Clean */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex justify-between items-center py-6 cursor-pointer transition-all ${
            isOpen ? "text-orange-600 bg-stone-50/40" : "text-stone-800 hover:text-orange-600"
          } px-6 rounded-t-sm group`}
        >
          <div className="flex items-center gap-6">
             <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-orange-100 text-orange-600' : 'bg-stone-50 text-stone-400 group-hover:bg-orange-500 group-hover:text-orange-600'}`}>
                <Globe size={18} />
             </div>
            <h2 className="text-lg sm:text-2xl font-semibold font-cinzel text-stone-900 tracking-wide">
              {title}
            </h2>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-stone-300 group-hover:text-orange-400"
          >
            <ChevronDown size={24} />
          </motion.div>
        </div>

        {/* Accordion content - Immersive Layout */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden bg-white"
            >
              <div className="px-6 py-8">
                {/* Fixed Premium Language Toggle */}
                <div className="flex justify-end mb-8">
                  <div className="inline-flex p-1 bg-stone-100 rounded-sm">
                    <button
                      onClick={() => setLanguage("english")}
                      className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm ${
                        language === "english" ? "bg-white text-orange-600 shadow-sm" : "text-stone-400 hover:text-stone-600"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage("kannada")}
                      className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded-sm font-kan ${
                        language === "kannada" ? "bg-white text-orange-600 shadow-sm" : "text-stone-400 hover:text-stone-600"
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>

                {/* Content Body */}
                <div className="max-w-4xl mx-auto space-y-12">
                  {content[language].map((section, idx) => (
                    <motion.section 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-8 border-l border-stone-200"
                    >
                      {section.heading && (
                        <h3 className="text-base sm:text-xl font-semibold font-cinzel text-stone-900 mb-4 tracking-wide">
                          {section.heading}
                        </h3>
                      )}
                      <p className="leading-relaxed sm:text-base text-sm text-stone-600 font-light text-justify">
                        {section.text}
                      </p>
                      
                      {/* Decorative Element */}
                      <div className="absolute top-0 left-[-4px] w-2 h-2 rounded-full bg-orange-500"></div>
                    </motion.section>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Accordion;
