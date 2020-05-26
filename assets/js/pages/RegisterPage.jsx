import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import usersApi from '../services/usersApi';

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    //gestion modification des input formulaire
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;
        setUser({
            ...user,
            [name]: value
        });
    }

    // gestion soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        const apiErrors = {};
        if(user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Les mots des passes doivent être identiques";
            setErrors(apiErrors);
            return;
        }

        try {
            const response = await usersApi.create(user);
            console.log(response);
            setErrors({});
            history.replace("/login");
        } catch ({ response }) {
            const { violations } = response.data;
            if (violations) {
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                })
                setErrors(apiErrors);
            }
        }
    }

    return ( <>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
            <Field name="firstname" type="text" label="Prénom" placeholder="Votre prénom" error={errors.firstname} value={user.firstname} onChange={handleChange} />
            <Field name="lastname" type="text" label="Nom" placeholder="Votre nom" error={errors.lastname} value={user.lastname} onChange={handleChange} />
            <Field name="email" type="text" label="Email" placeholder="Votre email" error={errors.email} value={user.email} onChange={handleChange} />
            <Field name="password" type="password" label="Mot de passe" placeholder="" error={errors.password} value={user.password} onChange={handleChange} />
            <Field name="passwordConfirm" type="password" label="Confirmer votre mot de passe" placeholder="" error={errors.passwordConfirm} value={user.passwordConfirm} onChange={handleChange} />
            <button type="submit" className="btn btn-success">M'inscrire</button>
            <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
        </form>
    </>);
}
 
export default RegisterPage;