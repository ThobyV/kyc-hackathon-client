import React, { createContext, useReducer, useContext, useEffect, useState } from "react";
import auth from './firebase/auth';

const AuthContext = createContext();
const AppContext = createContext();

const initialState = {
    profile: null,
    initialized: false,
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_PROFILE":
            return {
                ...state,
                conversations: [...action.payload, ...state.conversations],
            };
        default:
            throw new Error();
    }
};

const AppProvider = ({ children }) => {
    const [authUser] = useAuthState();
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={[state, dispatch, loading]}>
            {children}
        </AppContext.Provider>)
}

const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateObserver(setAuthUser);
        if (authUser) {
            console.log(authUser.uid);
            const { displayName, uid } = authUser;
            setAuthUser({ displayName, uid });
        }
        return () => unsubscribe();
    }, [authUser])


    return (
        <AuthContext.Provider value={[authUser, loading, setLoading]}>
            {children}
        </AuthContext.Provider>
    );
}

const useAppState = () => useContext(AppContext);

const useAuthState = () => useContext(AuthContext);

export {
    AppProvider,
    AuthProvider,
    useAppState,
    useAuthState,
}