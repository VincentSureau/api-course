import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function login(token) {
    // on stocke le token dans le local storage
    window.localStorage.setItem("authToken", token);
    // on préviens axios qu'on a maintenant un header par défaut sur les futures requêtes http
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

function authenticate(credentials) {
    return axios
        .post(LOGIN_API, credentials)
        .then(response => {
            console.log(response);
            return response.data.token;
        })
        .then(token => {
            login(token);
            return true;
        })
    ;
}

function setup() {
    const token = window.localStorage.getItem("authToken");

    if(token) {
        const jwtData = jwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime()) {
            login(token);
            return true;
        }
    }
    logout();
    return false;
}

export default {
    authenticate,
    logout,
    setup
};