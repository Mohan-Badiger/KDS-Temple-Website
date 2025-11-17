import React, { useState } from "react";

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("english");

  return (
    <div className={`w-full flex justify-center mt-5 rounded font-primary border px-7 border-gray-300`}>
      <div className="w-full">
        {/* Accordion header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center py-7 cursor-pointer text-lg font-semibold text-gray-800"
        >
          <div className="flex items-center gap-3">
            <h2 className="sm:text-3xl text-xl font-medium text-gray-700 sm:text-center">
              {title}
            </h2>
            <p className="w-8 md:w-17 h-[3px] bg-[#414141] mt-3 hidden md:block"></p>
          </div>
          <svg
            className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Accordion content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {/* Language toggle */}
          <div className="flex justify-end sm:pr-6 ">
            <button
              onClick={() => setLanguage(language === "english" ? "kannada" : "english")}
              className="px-4 h-11 w-24 text-white bg-primary font-kan"
            >
              {language === "english" ? "ಕನ್ನಡ" : "English"}
            </button>
          </div>

          {/* Content */}
          <div className="mt-3">
            {content[language].map((section, idx) => (
              <section key={idx} className="mt-3 pb-6">
                <h3 className="sm:text-3xl text-xl font-medium text-gray-700 font-kan">
                  {section.heading}
                </h3>
                <p className="mt-3 leading-7 sm:text-lg text-sm text-gray-500 font-kan">
                  {section.text}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
