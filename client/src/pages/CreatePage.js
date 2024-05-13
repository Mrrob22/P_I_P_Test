import React, { useState, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';

export const CreatePage = () => {
    const message = useMessage();
    const auth = useContext(AuthContext);
    const { loading, request } = useHttp();
    const [form, setForm] = useState({
        card_number: '',
        cvv: '',
        expiration_date: '',
    });

    const createCard = async () => {
        try {
            const data = await request('/api/cards', 'POST', form, {
                Authorization: `Basic ${auth.token}`
            });

            // Check if the response is not in JSON format
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format');
            }

            // Get the userId from the authenticated user's _id field
            const userId = data.owner;

            // Update the user's cards array with the _id of the newly created card
            const updatedUser = await request(`/api/cards/updateCards/${userId}/${data._id}`, 'PUT', null, {
                Authorization: `Basic ${auth.token}`
            });

            console.log('Updated User:', updatedUser);

            message(data.message);

        } catch (error) {
            console.error('Create Card Error:', error);
            // Handle the error appropriately, e.g., show an error message to the user
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
            <h1>Create Card</h1>
            <div className="input-field">
                <input
                    placeholder="Enter card number"
                    id="card_number"
                    type="text"
                    name="card_number"
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
                    onChange={changeHandler}
                />
                <label htmlFor="expiration_date">Expiration Date</label>
            </div>
            <div className="card-action">
                <button
                    className="btn yellow darken-4"
                    style={{ marginRight: 10 }}
                    onClick={createCard}
                    disabled={loading}
                >
                    Save
                </button>
            </div>
        </div>
    );
};
