import firebase from './firebase';
import 'firebase/auth';

import axios from 'redaxios';
import { baseUrl, defaultHeaders } from './../api'

class Auth {
    constructor() {
        this.auth = firebase.auth();
    }

    async requestCustomToken(data, authRoute) {
        try {
            let token = await axios.post(`${baseUrl}/${authRoute}`,
                data,
                defaultHeaders,
            )
            return Promise.resolve(token);
        } catch (error) {
            return Promise.reject(error);
        }
    }


    async phoneAuthTriggger(phoneNumber) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('otp-verification-btn', {
            'size': 'invisible',
            'callback': async (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                return await this.verifyPhoneNumber(phoneNumber);
            }
        });
    }

    async verifyPhoneNumber(phoneNumber) {
        //reset
        try {
            var appVerifier = window.recaptchaVerifier;
            let confirmationResult = await this.auth.signInWithPhoneNumber(phoneNumber, appVerifier)
            window.confirmationResult = confirmationResult;
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async verifyOTPCode(code) {
        try {
            let isConfirmed = await window.confirmationResult.confirm(code);
            return Promise.resolve(isConfirmed.user.uid)
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async signInWithCustomToken(token) {
        try {
            let authUser = await this.auth.signInWithCustomToken(token);
            Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    onAuthStateObserver(callback, error) {
        const unsubscribe = this.auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                let { displayName, uid, profilePhoto, email, emailVerified } = currentUser;
                let refreshedIdToken = await this.auth.currentUser.getIdToken();
                callback({
                    type: "SET_USER_PROFILE",
                    payload: { displayName, uid, email, emailVerified, profilePhoto }
                });
                callback({
                    type: "SET_ID_TOKEN",
                    payload: refreshedIdToken,
                })
            }
        })
        return unsubscribe;
    }


}

const auth = new Auth();

export default auth;