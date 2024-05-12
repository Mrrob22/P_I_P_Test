import {useCallback, useState} from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async(url, method = 'POST', body = null, headers = {}) => {
        setLoading(true);
        const userDataJSON = localStorage.getItem('userData')
        const userData = !!userDataJSON && JSON.parse(userDataJSON)
        // console.log('userData =', userData)

        try {
            if (body){
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json';
                userData?.token && (headers['Authorization'] = `Basic ${userData.token}`);
            }
            const options = {
                method,
                headers: {
                    // 'Content-Type': 'application/json',
                    ...headers
                },
                body: body ? JSON.stringify(body) : null
            };
            // console.log('url =', url)
            // console.log('method =', method)
            // console.log('body =', body)
            // console.log('headers =', headers)

            const response = await fetch(url, {
                method: method,
                body: body,
                headers: headers
            });
            const data = await response.json();
            // console.log('Data =', data)
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