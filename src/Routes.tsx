import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';

export default function Rotas() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Login} />
            </Switch>
        </BrowserRouter>
    );
}