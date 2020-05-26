import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import customersAPI from '../services/customersAPI';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchCustomers = async () => {
        try {
            const  data = await customersAPI.findAll();
            setCustomers(data);
        } catch (error) {
            console.log(error.response);
            toast.error("Erreur lors du chargement des clients !");
        }
    }

    useEffect(() => {
        fetchCustomers();
        // customersAPI
        //     .findAll()
        //     .then(response => setCustomers(response))
        //     .catch(error => console.log(error.response))
    }, [])

    const handleDelete = async id => {
        const originalCustomers = [...customers];
        
        setCustomers(customers.filter(customer => customer.id !== id));

        try {
            await customersAPI.delete(id)
            toast("Le client a bien été supprimé");
        } catch (error) {
            setCustomers(originalCustomers);
            console.log(error.response);
            toast.error("Une erreur est survenue");
        }

        // customersAPI
        //     .delete(id)
        //     .then(response => console.log("customer " + id + " deleted"))
        //     .catch(error => {
        //         setCustomers(originalCustomers);
        //         console.log(error.response);
        //     })
    }

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    // Gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    // Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c =>
            c.firstname.toLowerCase().includes(search.toLowerCase()) ||
            c.lastname.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    // Pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return ( 
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">
                    Créer un client
                </Link>
            </div>
            <div className="form-group">
                <input 
                    type="text"
                    onChange={handleSearch}
                    value={search}
                    className="form-control"
                    placeholder="Rechercher..."
                />
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprises</th>
                        <th>Facture</th>
                        <th>Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map(customer => <tr key={customer.id} >
                    
                        <td>{customer.id}</td>
                        <td><a href="#">{customer.firstname} {customer.lastname}</a></td>
                        <td>{customer.email}</td>
                        <td>{customer.company || '-'}</td>
                        <td className="text-center">
                            <span className="badge badge-pill badge-success">{customer.invoices.length}</span>
                        </td>
                        <td className="text-right">{customer.totalAmount.toLocaleString()} €</td>
                        <td>
                            <Link
                                to={"/customers/" + customer.id}
                                className="btn btn-sm btn-primary mr-1"
                            >
                                Editer
                            </Link>
                            <button 
                                className="btn btn-sm btn-danger"
                                disabled={customer.invoices.length > 0}
                                onClick={() => handleDelete(customer.id)}
                            >Supprimer</button>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>

            {itemsPerPage < filteredCustomers.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChanged={handlePageChange}
                />
            )}
        </>
     );
}
 
export default CustomersPage;