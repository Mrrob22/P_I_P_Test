import React, {useContext} from 'react'
import {NavLink, useNavigate } from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";

export const Navbar = () => {
    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        navigate("/")
    }

    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{padding: '0 2 rem'}}>
                <span className="brand-logo">++++</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/create">Создать</NavLink></li>
                    <li><NavLink to="/cards">Карты</NavLink></li>
                    <li><a href="/" onClick={logoutHandler}>Выйти</a></li>

                </ul>
            </div>
        </nav>
    )
}