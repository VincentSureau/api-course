import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import customersAPI from '../services/customersAPI';
import { toast } from 'react-toastify';

const CustomerPage = ({match, history}) => {

    const { id = 'new' } = match.params;

    const [editing, setEditing] = useState(false);

    // récupération du customer en fonction de l'identifiant
    const fetchCustomer = async id => {
        try {
            const { firstname, lastname, email, company } = await customersAPI.find(id);
            setCustomer({firstname, lastname, email, company});
        } catch (error) {
            console.log(error.response);
            toast.error("Le client n'a pas pu être chargé")
            history.replace("/customers");
        }
    };

    // chargement du customer au changement identifiant ou chargement composant
    useEffect(() => {
        if(id !== 'new') {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);


    const [customer, setCustomer] = useState({
        lastname: "",
        firstname: "",
        email: "",
        company: ""
    });

    //gestion modification des input formulaire
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;

        setCustomer({
            ...customer,
            [name]: value
        });
    }

    const [errors, setErrors] = useState({
        lastname: "",
        firstname: "",
        email: "",
        company: ""
    })

    // gestion soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                const response = await customersAPI.update(id, customer);
                toast("Le client a bien été modifié");
            } else {
                const response = await customersAPI.create(customer);
                toast("Le client a bien été créé");
            }
            setErrors({});
            history.replace("/customers");
        } catch ({response}) {
            const {violation} = response.data;
            if (violations) {
                const apiErrors = {};
                error.response.data.violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                })
                setErrors(apiErrors);
                toast.error("Une erreur est survenue");
            }
        }
    }

    return ( 
        <>
            {!editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1>}

            <form onSubmit={handleSubmit}>
                <Field name="lastname" label="nom" placeholder="Nom de famille du client" type="text" onChange={handleChange} value={customer.lastname} error={errors.lastname} />
                <Field name="firstname" label="prénom" placeholder="Prénom du client" type="text" onChange={handleChange} value={customer.firstname} error={errors.firstname} />
                <Field name="email" label="email" placeholder="vincent@exemple.net" type="email" onChange={handleChange} value={customer.email} error={errors.email} />
                <Field name="company" label="entreprise" placeholder="Entreprise du client" type="text" onChange={handleChange} value={customer.company} error={errors.company} />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
     );
}
 
export default CustomerPage;