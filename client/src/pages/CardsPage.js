import React, {useState, useEffect, useContext, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from "../hooks/message.hook";

import {AuthContext} from "../context/AuthContext"
import {Loader} from "../components/Loader";
import {CardsList} from "../components/CardsList";


export const CardsPage = () => {
    const [cards, setCards] = useState([])
    const {loading, request} = useHttp()
    const {token} = useContext(AuthContext)

    const fetchCards = useCallback(async () => {
        try {
            const fetched = await request('/api/cards', 'GET', null, {
                Authorization: `Basic ${token}`
            });

            setCards(fetched);

        } catch (error) {
            console.error('Error fetching cards:', error);
            // Handle the error or set an error state
        }
    }, [token, request]);

    useEffect(() => {
        fetchCards(); // Call fetchCards directly, no need to use .then()
    }, []);

    if(loading){
        return <Loader/>
    }

    return (
        <>
            {!loading && <CardsList  cards={cards}/>}
        </>
    )
}