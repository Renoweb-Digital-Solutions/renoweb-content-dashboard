"use client";

import { createContext, useContext, useState } from "react";

const NetworkContext = createContext();

export function NetworkProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    return (
        <NetworkContext.Provider value={{ loading, setLoading, saved, setSaved }}>
            {children}
        </NetworkContext.Provider>
    );
}

export const useNetwork = () => useContext(NetworkContext);