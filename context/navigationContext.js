import { createContext, useState } from "react";

export const NavigationContextApp = createContext();

export function NavigationContextWraper({children}){
    const [navigationActive, setNavigationActive] = useState('');
    const [loadingScreen, setLoadingScreen] = useState(false);
    const state = {
        navigationActive,
        setNavigationActive,
        loadingScreen,
        setLoadingScreen
    }

    return (
        <NavigationContextApp.Provider value={state}>
            {children}
        </NavigationContextApp.Provider>
    )
}

