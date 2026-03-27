import { useState, useEffect } from "react";
import axios from "./AxiosUser";

const useAuthPermission = () => {
    const [tubshin, setTubshin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const res = await axios.get("/get/auth/permission");
                setTubshin(res.data); // your controller just returns tubshin
            } catch (err) {
                setError(err);
                setTubshin(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPermission();
    }, []);

    return { tubshin, loading, error };
};

export default useAuthPermission;
