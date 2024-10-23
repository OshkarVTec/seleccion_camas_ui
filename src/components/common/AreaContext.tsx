import React, { createContext, useContext, useState } from "react";

const AreaContext = createContext<any>(null);

// Provider que maneja el estado
export const AreaProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedAreas, setSelectedAreas] = useState<any[]>([]);

    return (
        <AreaContext.Provider value={{ selectedAreas, setSelectedAreas }}>
            {children}
        </AreaContext.Provider>
    );
};

export const useAreas = () => useContext(AreaContext);