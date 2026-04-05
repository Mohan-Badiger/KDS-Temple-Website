import React, { useContext } from "react";
import { TempleContext } from "../context/TempleContext";
import { motion } from "framer-motion";

const TempleSelection = () => {
    const { temples, selectedTemple, setSelectedTemple, navigate } = useContext(TempleContext);

    const handleSelect = (temple) => {
        setSelectedTemple(temple);
    };

    const handleContinue = () => {
        if (selectedTemple) {
            navigate("/pooja");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto px-4 py-12 font-primary"
        >
            <div className="text-center mb-12">
                <h1 className="text-3xl text-gray-900 mb-2">Select Temple</h1>
                <p className="text-stone-500">Choose a divine destination for your seva</p>
                <div className="w-16 h-1 bg-orange-400 mx-auto mt-4 rounded-sm"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {temples.map((temple, index) => {
                    const isSelected = selectedTemple?._id === temple._id;

                    return (
                        <motion.div
                            key={temple._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSelect(temple)}
                            className={`group cursor-pointer bg-white border rounded-sm transition-colors duration-300 flex flex-col ${
                                isSelected ? "border-orange-400 shadow-md" : "border-stone-200 hover:border-orange-500"
                            }`}
                        >
                            <div className="relative h-48 w-full p-2 pb-0">
                                {temple.image ? (
                                    <img
                                        src={temple.image}
                                        alt={temple.name}
                                        className="w-full h-full object-cover rounded-sm"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-stone-50 flex items-center justify-center rounded-sm">
                                        <span className="text-stone-400 text-xs uppercase tracking-widest">No Image</span>
                                    </div>
                                )}
                            </div>

                            <div className="py-6 px-6 flex-grow flex flex-col bg-white">
                                <h3 className={`text-xl mb-2 tracking-tight uppercase transition-colors ${isSelected ? 'text-orange-500' : 'text-gray-900'}`}>
                                    {temple.name}
                                </h3>
                                
                                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                                    {temple.location}
                                </p>

                                <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                                    <span className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                        isSelected ? 'text-orange-500' : 'text-stone-400'
                                    }`}>
                                        {isSelected ? 'Selected' : 'Select Temple'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {temples.length === 0 && (
                <div className="text-center py-20 bg-stone-50 rounded-sm border border-dashed border-stone-300 max-w-5xl mx-auto mt-6">
                    <p className="text-stone-400 uppercase tracking-widest text-xs">Loading Temples...</p>
                </div>
            )}

            <div className="mt-16 border-t border-stone-200 pt-10 text-center max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center bg-stone-50 p-6 rounded-sm">
                <div className="text-left mb-6 sm:mb-0 hidden sm:block">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Status</p>
                    {selectedTemple ? (
                        <p className="text-lg text-gray-900 tracking-tight">{selectedTemple.name}</p>
                    ) : (
                        <p className="text-sm text-stone-500">No temple selected</p>
                    )}
                </div>
                
                <button
                    onClick={handleContinue}
                    disabled={!selectedTemple}
                    className={`
                        w-full sm:w-auto text-[11px] uppercase tracking-[0.2em] px-10 py-5 rounded-sm transition-colors shadow-sm
                        ${selectedTemple 
                            ? 'bg-orange-400 text-white hover:bg-orange-500' 
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none border border-stone-200'
                        }
                    `}
                >
                    Continue to Poojas
                </button>
            </div>
        </motion.div>
    );
};

export default TempleSelection;
