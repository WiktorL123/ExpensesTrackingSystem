import {useState} from "react";

export const useApiActions = (uri) => {
    const [error, setError] = useState(null)
    const performAction = async (method, endpoint, body = null) => {
        try {
            const res = fetch(`${uri}/${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body? JSON.stringify(body) : null,
            })
            if (!res.ok) throw new Error('Something went wrong')
            return await res.json()
        }
        catch (err){
            setError(err.message)
            console.log(err.message)
            throw err

        }

    }
    return {performAction, error}
}