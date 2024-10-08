import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useRefetchableData = (url: string) => {
    const explorerbackend = process.env.REACT_APP_BACKEND_API;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching data from:', explorerbackend + url);
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
    }, [explorerbackend, url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = async () => {
        console.log('Refetching data...');
        await fetchData();
    };

    return { data, loading, error, refetch };
};

export default useRefetchableData;
