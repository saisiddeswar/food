import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [userType, setUserType] = useState(localStorage.getItem('userType') || "");
    const [username, setUsername] = useState(localStorage.getItem('username') || "");
    
    let isLoggedIn = !!token;

    useEffect(() => {
        setToken(localStorage.getItem('token') || "");
        setUserType(localStorage.getItem('userType') || "");
        setUsername(localStorage.getItem('username') || "");
    }, []);

    const storeToken = (serverToken) => {
        localStorage.setItem('token', serverToken);  
        setToken(serverToken);                       
    };

    const storeUserDetails = (userType, username) => {
        localStorage.setItem('userType', userType);
        localStorage.setItem('username', username);
        setUserType(userType);
        setUsername(username);
    };

    const LogoutUser = () => {
        setToken("");  
        setUserType("");
        setUsername("");
        localStorage.removeItem('token');
        localStorage.removeItem('userType'); 
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, userType, username, storeToken, storeUserDetails, LogoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
