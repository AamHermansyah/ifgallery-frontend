import { createContext, useState } from "react";


export const PinsContextApp = createContext();

export function PinsContextWrapper({children}){
    const [searchTerm, setSearchTerm] = useState('');
    const state = {
        searchTerm,
        setSearchTerm
    }
    return (
        <PinsContextApp.Provider value={state}>
            {children}
        </PinsContextApp.Provider>
    )
}