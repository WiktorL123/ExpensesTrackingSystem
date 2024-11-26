import {useEffect, useState} from "react";

export const useFetchData = (uri, options ={}) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () =>{
            setLoading(true)
            try {
               const res = await fetch(uri, options)
                if (!res.ok) throw new Error('Something went wrong :(')
                const result = await res.json()
                setData(result)
            }
            catch (err){
                console.log(err.message)
                setError(err.message)
            }
            finally {
                setLoading(false)

            }
        }
        fetchData()
    }, [uri, options]);
    return {data, loading, error, setData}
}