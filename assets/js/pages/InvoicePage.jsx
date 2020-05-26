import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import customersAPI from '../services/customersAPI';
import invoiceAPI from '../services/invoiceAPI';

const InvoicePage = ({match, history}) => {

    const { id = 'new' } = match.params;

    const [editing, setEditing] = useState(false);

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    // récupération de l'invoice en fonction de l'identifiant
    const fetchInvoice = async id => {
        try {
            const { amount, customer, status } = await invoiceAPI.find(id);
            setInvoice({ amount, customer: customer["@id"], status });
        } catch (error) {
            console.log(error.response);
            history.replace("/invoices");
        }
    };

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    const [customers, setCustomers] = useState([]);

    //gestion modification des input formulaire
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;
        setInvoice({
            ...invoice,
            [name]: value
        });
    }

    // gestion soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (editing) {
                const response = await invoiceAPI.update(id, invoice);
            } else {
                const response = await invoiceAPI.create(invoice);
            }
            setErrors({});
            history.replace("/invoices");
        } catch ({ response }) {
            const { violations } = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                })
                setErrors(apiErrors);
            }
        }
    }

    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);

            if(!invoice.customer) {
                setInvoice({...invoice, customer: data[0]["@id"]});
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        fetchCustomers();
        if (id !== 'new') {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [])

    return (
        <>
            {!editing && <h1>Création d'une facture</h1> || <h1>Modification de la facture</h1>}
            <form onSubmit={handleSubmit}>
                <Field name="amount" type="number" placeholder="montant" label="montant" onChange={handleChange} value={invoice.amount} error={errors.amount} />
                <Select name="customer" label="client" error={errors.customer} onChange={handleChange} value={invoice.customer}>
                    {customers && customers.map(customer => (
                        <option key={customer.id} value={customer["@id"]}>{customer.firstname} {customer.lastname}</option>
                    ))}
                </Select>
                <Select name="status" label="statut" value={invoice.status} error={errors.status} onChange={handleChange}>
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retour</Link>
                </div>
            </form>
        </>
    );
}
 
export default InvoicePage;