import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const login = (callback) => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('sessionExpiry', Date.now() + 60 * 60 * 1000);
        if (callback) callback();
    }

    const logout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('sessionExpiry');
    }

    useEffect(() => {
        if (!isLoggedIn) return;

        const checkSession = () => {
            const expiry = localStorage.getItem('sessionExpiry');
            if (expiry) {
                const timeLeft = parseInt(expiry) - Date.now();
                if (timeLeft < 30000) {
                    alert("Your session is about to expire. Please log in again.");
                    logout();
                }
            }
        };

        checkSession();

        const interval = setInterval(checkSession, 10000);

        return () => clearInterval(interval);
    }, [isLoggedIn]);
    
    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}
