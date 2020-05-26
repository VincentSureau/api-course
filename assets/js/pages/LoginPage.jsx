import React, {useState, useContext} from 'react';
import AuthAPI from "../services/authAPI";
import AuthContext from '../contexts/AuthContext';

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    // gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;

        setCredentials({
            ...credentials,
            [name]: value
        });
    }

    // gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        } catch (error) {
            console.log(error);
            setError("Les informations de connexions ne sont pas valides");
        }
    }

    return ( <>
        <h1>Connexion à l'application</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="username">Adresse email</label>
                <input 
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    type="email"
                    id="email"
                    name="username"
                    placeholder="vincent@exemple.net"
                    value={credentials.username}
                    onChange={handleChange}
                />
                {
                    error &&
                    <p className="invalid-feedback">
                        {error}
                    </p>
                }
            </div>
            <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input 
                    type="password" 
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <button className="btn btn-success">Connexion</button>
            </div>
        </form>
    </> );
}
 
export default LoginPage;