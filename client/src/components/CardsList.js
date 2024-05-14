import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";

export const CardsList = ({ cards }) => {
    const [userEmails, setUserEmails] = useState([]);
    const [loadingEmails, setLoadingEmails] = useState(true);
    const [renderCount, setRenderCount] = useState(0); // Counter for render count
    const { loading: httpLoading, request } = useHttp();
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserEmails = async () => {
            try {

                const emails = [];
                let emptyLineAdded = false;
                const userDataResponseCheck = await request(
                    `/api/user/userData/${userId}`,
                    'GET'
                );
                const userDataCheck = await userDataResponseCheck;

                const userRole = await userDataCheck.role
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
                        console.log('userData 1 =', userData)
                        console.log('emails =', emails)

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

                            console.log('userData 2 =', userData)
                            console.log('emails =', emails)


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

    useEffect(() => {
        setRenderCount(prevCount => prevCount + 1); // Increment render count on each render
    }, []); // Run only on initial render

    if (httpLoading || loadingEmails || renderCount !== 2) { // Show loading message until second render
        return <p className="center">Loading...</p>;
    }

    if (!cards.length) {
        return <p className="center">Карт пока нет</p>;
    }

    // Check if all user emails have been fetched before rendering <td> elements
    const allEmailsFetched = userEmails.length === cards.length;



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
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};