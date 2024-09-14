import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useSearch = (value: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();
    const explorerbackend = process.env.REACT_APP_BACKEND_API

    const searchTx = async () => {
        if (!value) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${explorerbackend}/api/transaction/${value}`);
            if (response.ok) {
                const transactionData = await response.json();
                navigate('/transaction-details', { state: transactionData.message });
            } else {
                setError(new Error('Transaction not found'));
            }
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return { searchTx, loading, error };
};

export default useSearch;
