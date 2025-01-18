import React, { createContext, useContext, useState } from 'react';

// Create the context
const ContentContext = createContext();

// Create a provider component
export const ContentProvider = ({ children }) => {
    const [filecontent, setFilecontent] = useState({
        text: '',
        media: [],
        filePath: '',
    });

    return (
        <ContentContext.Provider value={{ filecontent, setFilecontent }}>
            {children}
        </ContentContext.Provider>
    );
};

// Custom hook to use the context
export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
