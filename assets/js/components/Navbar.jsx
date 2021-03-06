import React, { useContext } from 'react';
import AuthAPI from '../services/authAPI';
import {NavLink} from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Navbar = ({history}) => {

    const { isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        toast("Vous êtes déconnecté");
        history.replace("/login");
    }

    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <NavLink className="navbar-brand" to="/">Navbar</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="true" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="navbar-collapse collapse show" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/customers">Clients</NavLink>
                    </li>
                    {/* <li className="nav-item">
                        <NavLink className="nav-link" to="/customersPagination">Clients Bis</NavLink>
                    </li> */}
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/invoices">Factures</NavLink>
                    </li>
                </ul>
                <ul className="ml-auto navbar-nav">
                    {
                        !isAuthenticated &&
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/register">Inscription</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="btn btn-success" to="/login">Connexion !</NavLink>
                            </li>
                        </>
                    }
                    {
                        isAuthenticated &&
                        <li className="nav-item">
                            <button 
                                className="btn btn-danger"
                                onClick={handleLogout}
                            >Déconnexion</button>
                        </li>
                    }
                </ul>
            </div>
        </nav>
     );
}
 
export default Navbar;