import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from '../App';
import { toast } from "react-toastify";

const Remove = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const removePooja = async () => {
            if (!id) {
                console.error("Pooja ID is undefined!");
                alert("Invalid request. No Pooja ID found.");
                return;
            }

            try {
                const response = await axios.delete(`${backendUrl}/api/pooja/remove/${id}`);

                if (response.data.success) {
                   toast.success(response.data.success);
                   navigate('/pooja-manage/manage');
                } else {
                    toast.error(response.data.message);
                    
                }
            } catch (error) {
                console.error("Error removing pooja:", error);
            }
        };

        removePooja();
    }, [id, navigate]);

    return <p className="mt-10 text-lg">Removing Pooja...</p>;
};

export default Remove;
