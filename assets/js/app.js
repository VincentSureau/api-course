import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import '../css/app.css';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './contexts/AuthContext';
import CustomersPage from './pages/CustomersPage';
import CustomersPageWithPagination from './pages/CustomersPageWithPagination';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPages';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/authAPI';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.setup());

    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavbarWithRouter />
                <main className="container mt-5">
                    <Switch>
                        <PrivateRoute path="/customersPagination" component={CustomersPageWithPagination} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
}

ReactDOM.render(<App />, app);