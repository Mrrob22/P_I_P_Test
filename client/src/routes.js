import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {CardsPage} from "./pages/CardsPage";
import {DetailPage} from "./pages/DetailPage";
import {CreatePage} from "./pages/CreatePage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated){
        return (
            <Routes>
                <Route path="/cards" exact element={<CardsPage/>}></Route>
                <Route path="/create" exact element={<CreatePage/>}></Route>
                <Route path="/detail/:id" element={<DetailPage/>}></Route>
                <Route path="*" element={<Navigate to="/create" />} />

                {/*<Route path="/" element={user ? <AuthPage /> : <Navigate to="/login" />} />*/}
            </Routes>
        )
    }
    return (
        <Routes>
            <Route path="/" exact element={<AuthPage/>}></Route>
            {/*<Route path="/" element={user ? <AuthPage /> : <Navigate to="/login" />} />*/}
            <Route path="*" element={<Navigate to="/" />} />

        </Routes>
    )
}