const LanguageToggle = ({ language, setLanguage }) => (
  <div className="flex justify-end pr-6">
    <button
      onClick={() =>
        setLanguage(language === "english" ? "kannada" : "english")
      }
      className="px-4 h-11 w-24 text-white bg-primary font-kan transition-all hover:bg-primary/90"
    >
      {language === "english" ? "ಕನ್ನಡ" : "English"}
    </button>
  </div>
);

export default LanguageToggle;
