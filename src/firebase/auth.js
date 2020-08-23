import firebase from './firebase';
import 'firebase/auth';

import axios from 'redaxios';
import { baseUrl, defaultHeaders } from './../api'

class Auth {
    constructor() {
    }

    async signIn(data) {
        try {
            let user = await axios.post(`${baseUrl}/signin`,
                data,
                defaultHeaders,
            )
            return Promise.resolve(user)
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async signUp(data) {
        try {
            let user = await axios.post(`${baseUrl}/signup`,
                data,
                defaultHeaders,
            )
            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(error);
        }
    }

}

const auth = new Auth();

export default auth;