import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url: string) => {
    const explorerbackend = process.env.REACT_APP_BACKEND_API

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(explorerbackend+url);
                setData(response.data);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [url]);

    return { data, loading, error };
};

export default useFetch;
