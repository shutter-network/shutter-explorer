import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url: string) => {
    const explorerbackend = process.env.REACT_APP_BACKEND_API;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log('Fetching data from:', explorerbackend + url);
            try {
                const response = await axios.get(explorerbackend + url);
                console.log('Response data:', response.data);
                setData(response.data);
            } catch (error: any) {
                console.error('Error fetching data:', error);
                setError(error);
            } finally {
                setLoading(false);
                console.log('Finished fetching data');
            }
        };

        fetchData();
    }, [url, explorerbackend]);

    return { data, loading, error };
};

export default useFetch;
