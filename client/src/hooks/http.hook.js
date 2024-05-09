import {useCallback, useState} from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async(url, method = 'POST', body = null, headers = {}) => {
        setLoading(true);

        try {
            if (body){
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: body ? JSON.stringify(body) : null
            };

            const response = await fetch(url, {
                method: method,
                body: body,
                headers: headers
            });
            const data = await response.json();
            console.log('Data =', data)
            if (!response.ok) {
                throw new Error(data.message || 'Что-то пошло не так');
            }

            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            setError(error.message);
            throw error;
        }
    }, [])

    const clearError = useCallback( ()=>setError(null), [] )


    return {loading, request, error, clearError}
}