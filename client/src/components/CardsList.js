import React, { useState, useEffect, useContext, useRef } from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export const CardsList = ({ cards }) => {
    const navigate = useNavigate();
    const [userEmails, setUserEmails] = useState([]);
    const [role, setRole] = useState(null);
    const [loadingEmails, setLoadingEmails] = useState(true);
    const [renderCount, setRenderCount] = useState(0); // Counter for render count
    const { loading: httpLoading, request } = useHttp();
    const { userId , auth} = useContext(AuthContext);

    useEffect(() => {
        setRenderCount(1); // Set render count to 1 on initial render
    }, []);

    useEffect(() => {
        const fetchUserEmails = async () => {
            try {

                const emails = [];
                // let emptyLineAdded = false;
                const userDataResponseCheck = await request(
                    `/api/user/userData/${userId}`,
                    'GET'
                );
                const userDataCheck = await userDataResponseCheck;

                const userRole = await userDataCheck.role
                setRole(userRole);

                // Fetch user data for all cards if user has role 1
                if (userRole === "1") {
                    for (const card of cards) {
                        const Id = card.owner;
                        const userDataResponse = await request(
                            `/api/user/userData/${Id}`,
                            'GET'
                        );
                        const userData = await userDataResponse;

                        // if (!emptyLineAdded) {
                        //     emails.push(''); // Add empty line
                        //     emptyLineAdded = true;
                        // }
                        const email = JSON.stringify(userData.email) || 'Unknown';
                        // console.log('userData 1 =', userData)
                        // console.log('emails =', emails)

                        emails.push(email);
                    }
                } else {

                    // Fetch user data only for cards owned by the user


                    for (const card of cards) {

                        if (card.owner === userId) {

                            const userDataResponse = await request(
                                `/api/user/userData/${userId}`,
                                'GET'
                            );
                            const userData = await userDataResponse;

                            // if (!emptyLineAdded) {
                            //     emails.push(''); // Add empty line
                            //     emptyLineAdded = true;
                            // }
                            const email = JSON.stringify(userData.email)  || 'Unknown';

                            // console.log('userData 2 =', userData)
                            // console.log('emails =', emails)


                            emails.push(email);
                        }
                    }

                }

                setUserEmails([...emails]);
                setLoadingEmails(false);
            } catch (error) {
                console.error('Error fetching user emails:', error);
                const unknownEmails = Array(cards.length).fill('Unknown');
                setUserEmails([...unknownEmails]);
                setLoadingEmails(false);
            }
        };

        fetchUserEmails();
    }, [cards, request, userId]); // Include userId and userRole as dependencies

    const handleEdit = async (cardId) => {
        try {
            const userDataJSON = localStorage.getItem('userData');
            const userData = !!userDataJSON && JSON.parse(userDataJSON);
            const token = userData.token;

            // Fetch the card data based on the cardId
            const fetchedCardResponse = await request(`/api/cards/${cardId}`, 'GET', null, {
                Authorization: `Basic ${token}` // Use Bearer authentication
            });

            // Navigate to the createPage with parameters
            // navigate(`/createPage?edit=true&cardId=${cardId}`, { state: { cardData: fetchedCardResponse } });

            navigate(`/create?edit=true&cardId=${cardId}`, { state: { cardData: fetchedCardResponse } });

        } catch (error) {
            console.error('Error fetching card data:', error);
            // Handle the error appropriately, e.g., show an error message to the user
        }
    };

    const handleDelete = async (cardId) => {
        try {
            const userDataJSON = localStorage.getItem('userData');
            const userData = !!userDataJSON && JSON.parse(userDataJSON);
            const token = userData.token;

            // Fetch the card data based on the cardId
            const fetchedCardResponse = await request(`/api/cards/${cardId}`, 'DELETE', null, {
                Authorization: `Basic ${token}` // Use Bearer authentication
            });

            // Navigate to the createPage with parameters
            // navigate(`/createPage?edit=true&cardId=${cardId}`, { state: { cardData: fetchedCardResponse } });


        } catch (error) {
            console.error('Error deleting card:', error);
            // Handle the error appropriately, e.g., show an error message to the user
        }
    }

    // Run only on initial render

    if (httpLoading || loadingEmails || renderCount !== 1) { // Show loading message until first render
        return <p className="center">Loading...</p>;
    }

    if (!cards.length) {
        return <p className="center">Карт пока нет</p>;
    }

    // Check if all user emails have been fetched before rendering <td> elements
    // const allEmailsFetched = userEmails.length === cards.length;



    return (
        <table>
            <thead>
            <tr>
                <th>№</th>
                <th>Номер карты</th>
                <th>CVV</th>
                <th>Дата окончания действия</th>
                <th>Почта владельца</th>
            </tr>
            </thead>
            <tbody>
            {cards.map((card, index) => {
                return (
                    <tr key={card._id}>
                        <td>{index + 1}</td>
                        <td>{card.card_number}</td>
                        <td>{card.cvv}</td>
                        <td>{card.expiration_date}</td>
                        <td>{userEmails[index] || 'Loading...'}</td>
                        <td>
                            <button onClick={() => handleEdit(card._id, card)}>
                                <img src="https://www.svgrepo.com/show/17716/gear.svg" alt=''
                                     style={{width: '30px', height: '30px'}}/>
                            </button>
                            {!!role && role === "1" && (
                                <button onClick={() => handleDelete(card._id)}>
                                    <img src="https://www.svgrepo.com/show/20605/close-cross.svg" alt=''
                                         style={{width: '30px', height: '30px'}}/>
                                </button>
                            )}
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};