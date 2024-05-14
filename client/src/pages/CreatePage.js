import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';


export const CreatePage = () => {
    const location = useLocation();
    const { loading, request } = useHttp();
    const message = useMessage();
    const [form, setForm] = useState({
        card_number: '',
        cvv: '',
        expiration_date: ''
    });

    const queryParams = new URLSearchParams(location.search);

    const isEdit = queryParams.get("edit") === "true";
    const cardId = queryParams.get("cardId");


    const fetchCardData = async () => {
        try {
            const userDataJSON = localStorage.getItem('userData');
            const userData = !!userDataJSON && JSON.parse(userDataJSON);
            const token = userData.token;

            const fetchedCard = await request(`/api/cards/${cardId}`, 'GET', null, {
                Authorization: `Basic ${token}`
            });

            setForm({
                card_number: fetchedCard.card_number,
                cvv: fetchedCard.cvv,
                expiration_date: fetchedCard.expiration_date
            });
        } catch (error) {
            console.error('Fetch Card Data Error:', error);
        }
    };

    useEffect(() => {
        console.log('isEdit_2 = ', isEdit);
        console.log('cardId_2 = ', cardId);

        if (location.state && location.state.cardData) {
            const { cardData } = location.state;
            console.log('cardData = ', cardData);

            setForm({
                card_number: cardData.card_number,
                cvv: cardData.cvv,
                expiration_date: cardData.expiration_date
            });
            console.log('isEdit_1 = ', isEdit);
            console.log('cardId_1 = ', cardId);
        } else if (isEdit && cardId) {
            fetchCardData();
            console.log('isEdit_3 = ', isEdit);
            console.log('cardId_3 = ', cardId);
        }
    }, [location.state, request, isEdit, cardId]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isEdit && cardId) {
            await updateCard(cardId);
        } else {
            await createCard();
        }
    };

    const createCard = async () => {
        try {
            const userDataJSON = localStorage.getItem('userData');
            const userData = !!userDataJSON && JSON.parse(userDataJSON);
            const token = userData.token;

            const data = await request('/api/cards', 'POST', form, {
                Authorization: `Basic ${token}`
            });

            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format');
            }

            const userId = data.owner;
            const updatedUser = await request(`/api/cards/updateCards/${userId}/${data._id}`, 'PUT', null, {
                Authorization: `Basic ${token}`
            });

            message(data.message);

        } catch (error) {
            console.error('Create Card Error:', error);
        }
    };

    const updateCard = async (cardId) => {
        try {
            const userDataJSON = localStorage.getItem('userData');
            const userData = !!userDataJSON && JSON.parse(userDataJSON);
            const token = userData.token;

            const updatedCard = await request(`/api/cards/${cardId}`, 'PUT', form, {
                Authorization: `Basic ${token}`
            });

            message('Card updated successfully');
        } catch (error) {
            console.error('Update Card Error:', error);
        }
    };

    const changeHandler = (event) => {
        const fieldName = event.target.name;
        const value = event.target.value;

        setForm(prevForm => ({
            ...prevForm,
            [fieldName]: value,
        }));
    };

    return (
        <div>
            <h1>{isEdit ? 'Edit Card' : 'Create Card'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-field">
                    <input
                        placeholder="Enter card number"
                        id="card_number"
                        type="text"
                        name="card_number"
                        value={form.card_number}
                        onChange={changeHandler}
                    />
                    <label htmlFor="card_number">Card Number</label>
                </div>
                <div className="input-field">
                    <input
                        placeholder="Enter CVV"
                        id="cvv"
                        type="password"
                        name="cvv"
                        value={form.cvv}
                        onChange={changeHandler}
                    />
                    <label htmlFor="cvv">CVV</label>
                </div>
                <div className="input-field">
                    <input
                        placeholder="Enter expiration date"
                        id="expiration_date"
                        type="date"
                        name="expiration_date"
                        value={form.expiration_date}
                        onChange={changeHandler}
                    />
                    <label htmlFor="expiration_date">Expiration Date</label>
                </div>
                <button className="btn yellow darken-4" type="submit" disabled={loading}>
                    {isEdit ? 'Save' : 'Create'}
                </button>
            </form>
        </div>
    );
};
