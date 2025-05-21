import { createContext, useState, useContext } from "react";

const StateContext = createContext({
    currentUser: {},
    setCurrentUser: () => {},
});

export const ContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    return (
        <StateContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </StateContext.Provider>
    );
};

export const useUserStateContext = () => useContext(StateContext);
