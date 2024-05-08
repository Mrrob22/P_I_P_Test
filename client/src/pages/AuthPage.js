import React from 'react'

export const AuthPage = () => {
    return(
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Заходим, заходим</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn yellow darken-4" style={{marginRight: 10}}>Войти</button>
                        <button className="btn grey whiten-1 black-text">Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    )
}