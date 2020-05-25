import React from 'react';

const Navbar = (props) => {
    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="true" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="navbar-collapse collapse show" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#customers">Clients</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#customersPagination">Clients Paginés</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#invoices">Factures</a>
                    </li>
                </ul>
                <ul className="ml-auto navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="#">Inscription</a>
                    </li>
                    <li className="nav-item">
                        <a className="btn btn-success" href="#">Connexion !</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="btn btn-danger">Déconnexion</a>
                    </li>
                </ul>
            </div>
        </nav>
     );
}
 
export default Navbar;