import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export const TempleContext = createContext();

const TempleContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    // Booking state
    const [selectedPoojas, setSelectedPoojas] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
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
        selectedPoojas, totalAmount, handleCheckboxChange
    };

    return (
        <TempleContext.Provider value={value}>
            {props.children}
        </TempleContext.Provider>
    );
};

export default TempleContextProvider;
