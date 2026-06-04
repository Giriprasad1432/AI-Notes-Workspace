import { createContext, useState, useContext,useEffect } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isLight, setIsLight] = useState(true);
    useEffect(()=>{
        const root=document.documentElement;
        root.setAttribute("data-light",String(isLight));
    },[isLight])
    return (
        <UIContext.Provider value={{ isLight, setIsLight }}>
            {children}
        </UIContext.Provider>
    )
}

export const useUI=()=> useContext(UIContext);