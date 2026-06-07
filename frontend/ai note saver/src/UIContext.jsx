import { createContext, useState, useContext,useEffect } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isLight, setIsLight] = useState(() => {
        const savedTheme = localStorage.getItem('isLight');
        return savedTheme !== null ? savedTheme === 'true' : true;
    });

    useEffect(() => {
        localStorage.setItem('isLight', String(isLight));
        const root = document.documentElement;
        root.setAttribute("data-light", String(isLight));
    }, [isLight]);

    return (
        <UIContext.Provider value={{ isLight, setIsLight }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI=()=> useContext(UIContext);