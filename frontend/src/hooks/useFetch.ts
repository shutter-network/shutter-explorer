import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url: string, interval: number) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(url);
                setData(response.data);
                setLoading(false);
            } catch (err: any) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, interval);

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [url, interval]);

    return { data, loading, error };
};

export default useFetch;
