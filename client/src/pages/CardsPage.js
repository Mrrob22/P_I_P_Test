import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import { CardsList } from '../components/CardsList';

export const CardsPage = () => {
    const [cards, setCards] = useState([]);
    const { loading, request } = useHttp();
    const { token , userId} = useContext(AuthContext);


    const fetchCards = useCallback(async () => {
        try {
            const userDataResponseCheck = await request(
                `/api/user/userData/${userId}`,
                'GET'
            );
            const userDataCheck = await userDataResponseCheck;

            const userRole = await userDataCheck.role
            if (userRole === "1") {

                const fetched = await request('/api/cards', 'GET', null, {
                    Authorization: `Basic ${token}`
                });

                setCards(fetched);
            } else {
                const fetched = await request(`/api/cards/user/${userId}`, 'GET', null, {
                    Authorization: `Basic ${token}`
                });

                setCards(fetched);
            }
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }, [token, request, userId]);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {!loading && <CardsList cards={cards} />}
        </>
    );
};