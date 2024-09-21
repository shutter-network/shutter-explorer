import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchWithPolling = (url: string, interval: number) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false); // Change initial loading state
    const [error, setError] = useState<Error | null>(null);
    const backendUrl = process.env.REACT_APP_BACKEND_API

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(backendUrl + url);
                setData(response.data);
                setLoading(false);
                setError(null)
            } catch (err: any) {
                setData(null)
                setError(err);
                setLoading(false);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, interval);

        return () => clearInterval(intervalId);
    }, [url, interval, backendUrl]);

    return { data, loading, error };
};

export default useFetchWithPolling;
