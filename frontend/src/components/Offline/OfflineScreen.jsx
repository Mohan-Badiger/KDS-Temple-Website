import React, { useState } from 'react';

const OfflineScreen = () => {
  const [checking, setChecking] = useState(false);

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-stone-900/90 backdrop-blur-md flex items-center justify-center font-primary px-4">
      <div className="max-w-md w-full bg-white border border-stone-200 p-8 rounded-xl shadow-2xl text-center flex flex-col items-center">
        
        {/* Simple Static Disconnected Signal Tower Icon */}
        <div className="w-16 h-16 bg-amber-50 text-orange-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* Signal Tower Base & Stem */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8M12 12v6M9 15h6" />
            {/* Waves */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8a10 10 0 0114 0M7.5 10.5a6.5 6.5 0 019 0M10 13a3 3 0 014 0" />
            {/* Disconnection Diagonal Slash */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18" />
          </svg>
        </div>

        <h2 className="font-cinzel text-xl sm:text-2xl text-gray-900 tracking-wide uppercase mb-3">
          Internet Not Connected
        </h2>
        
        <p className="text-xs sm:text-sm text-stone-500 mb-8 leading-relaxed uppercase tracking-widest max-w-xs">
          Please check your network connection to sync temple records.
        </p>

        <button
          onClick={handleRetry}
          disabled={checking}
          className={`w-full py-4 text-white text-xs font-semibold uppercase tracking-widest rounded-md shadow-sm transition-all flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] ${
            checking ? "opacity-85 cursor-wait" : "cursor-pointer"
          }`}
        >
          {checking ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Checking Connection...
            </>
          ) : (
            "Retry Connection"
          )}
        </button>
      </div>
    </div>
  );
};

export default OfflineScreen;
