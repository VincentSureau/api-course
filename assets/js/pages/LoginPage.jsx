import React, {useState, useContext} from 'react';
import AuthAPI from "../services/authAPI";
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';
import { toast } from 'react-toastify';

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
            toast("Vous êtes connecté !");
            history.replace("/customers");
        } catch (error) {
            console.log(error);
            setError("Les informations de connexions ne sont pas valides");
            toast.error("Une erreur est survenue");
        }
    }

    return ( <>
        <h1>Connexion à l'application</h1>
        <form onSubmit={handleSubmit}>
            <Field 
                label="Email"
                type="email"
                name="username"
                placeholder="vincent@exemple.net"
                value={credentials.username}
                onChange={handleChange}
                error={error}
            />
            <Field
                label="Mot de passe"
                type="password" 
                name="password"
                placeholder="mot de passe"
                value={credentials.password}
                onChange={handleChange}
                error=""
            />
            <div className="form-group">
                <button className="btn btn-success">Connexion</button>
            </div>
        </form>
    </> );
}
 
export default LoginPage;