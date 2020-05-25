import '../css/app.css';

console.log('Hello Webpack Encore! Edit me in assets/js/app.js');

import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { HashRouter, Switch, Route } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';

const App = () => {
    return <HashRouter>
        <Navbar />
        <main className="container mt-5">
            <Switch>
                <Route path="/customersPagination" component={CustomersPageWithPagination} />
                <Route path="/customers" component={CustomersPage} />
                <Route path="/" component={HomePage} />
            </Switch>
        </main>
    </HashRouter>
}

ReactDOM.render(<App />, app);