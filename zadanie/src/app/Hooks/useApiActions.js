import {useState} from "react";

export const useApiActions = (baseUri) => {
    const [error, setError] = useState(null);

    const performAction = async (endpoint = '', { method, body = null }) => {
        try {
            const response = await fetch(`${baseUri}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : null,
            });
            if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (err) {
            setError(err.message);
            console.log(err.message);
            throw err;
        }
    };

    return { performAction, error };
};
