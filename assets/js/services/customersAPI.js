import axios from "axios";
import Cache from "./cache";
import { CUSTOMERS_API } from "../config";

async function findAll() {

    const cachedCustomers = await Cache.get("customers");
    
    if (cachedCustomers) {
        return cachedCustomers;
    }

    return axios
        .get(CUSTOMERS_API)
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
        .get(CUSTOMERS_API + "/" + id)
        .then(response => {
            Cache.set("customer."+id, response.data)
            return response.data
        })
    ;
}

function create(customer) {
    return axios
        .post(CUSTOMERS_API, customer)
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
        .put(CUSTOMERS_API + "/" + id, customer)
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
        .delete(CUSTOMERS_API + "/" + id)
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