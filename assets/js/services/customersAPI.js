import axios from "axios";
import Cache from "./cache";

async function findAll() {

    const cachedCustomers = await Cache.get("customers");
    
    if (cachedCustomers) {
        return cachedCustomers;
    }

    console.log("not in cache")

    return axios
        .get("http://localhost:8000/api/customers")
        .then(response => {
            const customers = response.data["hydra:member"]
            Cache.set("customers", customers);
            return customers;
        })
    ;
}

function find(id) {
    return axios
        .get("http://localhost:8000/api/customers/" + id)
        .then(response => response.data)
    ;
}

function create(customer) {
    return axios.post("http://localhost:8000/api/customers", customer);
}

function update(id, customer) {
    return axios.put("http://localhost:8000/api/customers/" + id, customer);
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