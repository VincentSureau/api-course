import React, { useEffect, useState } from 'react';
import Pagination from "../components/Pagination";
import customersAPI from '../services/customersAPI';

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
        } catch (error) {
            setCustomers(originalCustomers);
            console.log(error.response);
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
            <h1>Liste des clients</h1>
            <div className="form-group">
                <input 
                    type="text"
                    onChange={handleSearch}
                    value={search}
                    className="form-controle"
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