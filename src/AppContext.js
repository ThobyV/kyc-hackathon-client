import React, { createContext, useReducer, useContext, useEffect, useState } from "react";
import auth from './firebase/auth';

const AppContext = createContext();

const initialState = {
    userProfile: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_AUTH_USER":
            return {
                ...state,
                userProfile: [...action.payload, ...state.userProfile],
            };
        default:
            throw new Error();
    }
};

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(false);    

    return (
        <AppContext.Provider value={[state, dispatch, loading]}>
            {children}
        </AppContext.Provider>)
}

const useAppState = () => useContext(AppContext);

export {
    AppProvider,
    useAppState,
}