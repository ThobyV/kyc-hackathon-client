import React, { createContext, useReducer, useContext, useEffect, useState } from "react";
import auth from './firebase/auth';

const AppContext = createContext();

const initialState = {
    userProfile: {},
    idToken: null,
    bvnData: {},
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER_PROFILE":
            return {
                ...state,
                userProfile: { ...action.payload, ...state.userProfile },
            };
        case "SET_ID_TOKEN":
            return {
                ...state,
                idToken: action.payload,
            };
        case "SET_BVN_DETAILS":
            return {
                ...state,
                bvnData:  { ...action.payload},
            };
        default:
            throw new Error();
    }
};

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        //handle auth state changes
        const unsubscribe = auth.onAuthStateObserver(dispatch);
        return () => unsubscribe();
    }, [state.userProfile.uid]);

    return (
        <AppContext.Provider value={[state, dispatch]}>
            {children}
        </AppContext.Provider>)
}

const useAppState = () => useContext(AppContext);

export {
    AppProvider,
    useAppState,
}