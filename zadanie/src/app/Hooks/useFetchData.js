import { useEffect, useState, useMemo } from "react";

export const useFetchData = (uri, options = {}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const memoizedOptions = useMemo(() => options, [options]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(uri, memoizedOptions);
                if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
                const result = await response.json();
                if (isMounted) setData(result);
            } catch (err) {
                if (isMounted) setError(err.message);
                console.error(err.message); // Log błędu
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [uri, memoizedOptions]);

    return { data, loading, error, setData };
};
