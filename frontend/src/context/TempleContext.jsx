import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../utils/axiosInstance";

export const TempleContext = createContext();

const TempleContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const navigate = useNavigate();

    // Multi-Temple State
    const [temples, setTemples] = useState([]);
    const [selectedTemple, setSelectedTemple] = useState(() => {
        const saved = localStorage.getItem('selectedTemple');
        return saved ? JSON.parse(saved) : null;
    });

    // Booking state
    const [selectedPoojas, setSelectedPoojas] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedDate, setSelectedDate] = useState(""); // Shared date for booking

    // Global Settings State
    const [settings, setSettings] = useState(null);

    const fetchSettings = async () => {
        try {
            const res = await axiosInstance.get('/api/settings');
            if (res.data.success) {
                setSettings(res.data.settings);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    // Sync selectedTemple to localStorage
    useEffect(() => {
        if (selectedTemple) {
            localStorage.setItem('selectedTemple', JSON.stringify(selectedTemple));
        } else {
            localStorage.removeItem('selectedTemple');
        }
    }, [selectedTemple]);

    // Fetch Temples
    const fetchTemples = async () => {
        try {
            const res = await axiosInstance.get('/api/temple/list');
            if (res.data.success) {
                setTemples(res.data.temples);
                
                // Sync selectedTemple with latest data
                if (selectedTemple) {
                    const updatedTemple = res.data.temples.find(t => t._id === selectedTemple._id);
                    if (updatedTemple) {
                        setSelectedTemple(updatedTemple);
                    }
                }

                // Sync selectedPoojas with latest data (requires fetching poojas or having them in temple data)
                // If poojas are separate, we might need a separate sync or handle it in PaymentGateway
            }
        } catch (error) {
            console.error("Error fetching temples:", error);
        }
    };

    useEffect(() => {
        const storedLastActivity = localStorage.getItem('lastActivity');
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;

        // Clear session if > 10 mins passed since last activity (across tabs/windows)
        if (storedLastActivity && (now - parseInt(storedLastActivity, 10) >= tenMinutes)) {
            localStorage.removeItem('token');
            localStorage.removeItem('lastActivity');
            setToken('');
        } else if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
        fetchTemples();
        fetchSettings();
    }, []);

    useEffect(() => {
        const total = selectedPoojas.reduce((sum, pooja) => sum + pooja.price, 0);
        setTotalAmount(total);
    }, [selectedPoojas]);

    const handleCheckboxChange = (pooja) => {
        setSelectedPoojas(prev =>
            prev.some(p => p._id === pooja._id)
                ? prev.filter(p => p._id !== pooja._id)
                : [...prev, pooja]
        );
    };

    const value = {
        backendUrl, navigate, setToken, token,
        temples, fetchTemples,
        selectedTemple, setSelectedTemple,
        selectedPoojas, setSelectedPoojas,
        totalAmount, handleCheckboxChange,
        selectedDate, setSelectedDate,
        settings, fetchSettings
    };

    return (
        <TempleContext.Provider value={value}>
            {props.children}
        </TempleContext.Provider>
    );
};

export default TempleContextProvider;
