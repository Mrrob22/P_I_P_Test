import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from "../hooks/message.hook";

import {AuthContext} from "../context/AuthContext"


export const CardsPage = () => {
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
            // console.log('Create Card form = ', form);

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${auth.token}`
                },
                body: JSON.stringify(form)
            };

            const response = await fetch('/api/card/generate-card', requestOptions); // Pass requestOptions directly to fetch

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // console.log('createCard data =', data);
            message(data.message);
        } catch (error) {
            console.error('Create Card Error:', error);
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

    useEffect(() => {
        // console.log('form =', form);
    }, [form]);

    return(
        <div>
            <h1>Cards Page</h1>
            <div className="input-field">
                <input
                    placeholder="Введите номер карты"
                    id="card_number"
                    type="text"
                    name="card_number"
                    onChange={changeHandler}

                />
                <label htmlFor="card_number">Card Number</label>
            </div>
            <div className="input-field">
                <input
                    placeholder="Введите cvv"
                    id="cvv"
                    type="password"
                    name="cvv"
                    onChange={changeHandler}

                />
                <label htmlFor="cvv">CVV</label>
            </div>
            <div className="input-field">
                <input
                    placeholder="Введите срок окончания действия"
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
                    style={{marginRight: 10}}
                    onClick={createCard}
                    disabled={loading}
                >
                    Сохранить
                </button>
            </div>
        </div>
    )
}