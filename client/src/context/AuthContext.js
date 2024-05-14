import { createContext, useState } from "react";

function noop() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false

});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    // const [userRole, setUserRole] = useState(2);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (token, userId) => {
        setToken(token);
        setUserId(userId);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        // setUserRole(null)
        setIsAuthenticated(false);
    };

    // console.log('token =', token)

    return (
        <AuthContext.Provider value={{ token, userId, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
