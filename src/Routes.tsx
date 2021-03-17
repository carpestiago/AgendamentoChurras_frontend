import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Agenda from './pages/Agenda';
import Cadastro from './pages/Cadastro';
import Detalhes from './pages/Detalhes';

export default function Rotas() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Login} />
                <Route path='/agenda' component={Agenda} />
                <Route path='/cadastro' component={Cadastro} />
                <Route path='/detalhes' component={Detalhes} />
            </Switch>
        </BrowserRouter>
    );
}