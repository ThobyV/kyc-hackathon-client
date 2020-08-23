import firebase from './firebase';
import axios from 'redaxios';
import { baseUrl, defaultHeaders } from './../api'

class Auth {
    constructor() {
        this.authRef = firebase.auth();
    }

    async signInWithCustomToken(token) {
        try {
            await this.authRef.signInWithCustomToken(token);
            return Promise.resolve('signed in user successfully');
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async signIn(data) {
        try {
            let token = await axios.post(`${baseUrl}/signin`,
                data,
                defaultHeaders,
            )
            let triggerAuthStateOb = await this.signInWithCustomToken(token);
            return Promise.resolve('auth state observer triggered with user details')
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async signUp(data) {
        try {
            let createUser = axios.post(`${baseUrl}/signup`,
                data,
                defaultHeaders,
            )
            return Promise.resolve('user created');
        } catch (error) {
            return Promise.reject(error);
        }
    }

    onAuthStateObserver(callback, fallback) {
        const unsubscribe = this.authRef.onAuthStateChanged((currentUser) => {
            callback(currentUser)
        })
        return unsubscribe;
    }

}

const auth = new Auth();

export default auth;