import axios from "axios";
import Cache from "./cache";

async function findAll() {

    const cachedCustomers = await Cache.get("customers");
    
    if (cachedCustomers) {
        return cachedCustomers;
    }

    return axios
        .get("http://localhost:8000/api/customers")
        .then(response => {
            const customers = response.data["hydra:member"]
            Cache.set("customers", customers);
            return customers;
        })
    ;
}

async function find(id) {
    const cachedCustomers = await Cache.get("customers");

    if (cachedCustomers) {
        const index = cachedCustomers.findIndex(c => c.id == id);
        if (index) {
            return cachedCustomers[index];
        }
    }

    return axios
        .get("http://localhost:8000/api/customers/" + id)
        .then(response => {
            Cache.set("customer."+id, response.data)
            return response.data
        })
    ;
}

function create(customer) {
    return axios
        .post("http://localhost:8000/api/customers", customer)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");
            if (cachedCustomers) {
                Cache.set("customers", [...cachedCustomers, response.data]);
            }

            return response;
        })
    ;
}

function update(id, customer) {
    return axios
        .put("http://localhost:8000/api/customers/" + id, customer)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");

            if(cachedCustomers) {
                const index = cachedCustomers.findIndex(c => c.id == id);
                cachedCustomers[index] = response.data;
                Cache.set("customers", cachedCustomers);
            }

            return response;
        })
    ;
}

function deleteCustomer(id) {
    return axios
        .delete("http://localhost:8000/api/customers/" + id)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");
            if(cachedCustomers) {
                Cache.set("customers", cachedCustomers.filter(c => c.id !== id));
            }

            return response;
        })
    ;
}

export default {
    create,
    find,
    findAll,
    delete: deleteCustomer,
    update
}