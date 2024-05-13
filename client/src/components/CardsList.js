import React from "react";

export const CardsList = ({ cards }) => {
    if (!cards.length){
        return <p className="center">Карт пока нет</p>
    }
    return (
        <table>
            <thead>
            <tr>
                <th>№</th>
                <th>Номер карты</th>
                <th>CVV</th>
                <th>Дата окончания действия</th>
            </tr>
            </thead>

            <tbody>
            { cards.map((card, index) => {
                return (
                    <tr key={card._id}>
                        <td>{index + 1}</td>
                        <td>{card.card_number}</td>
                        <td>{card.cvv}</td>
                        <td>{card.expiration_date}</td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}
