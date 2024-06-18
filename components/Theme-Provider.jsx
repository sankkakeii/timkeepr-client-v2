// Import necessary React components and hooks
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Create a context for managing theme and sidebar state
const ThemeContext = createContext();

// Define the ThemeProvider component
export function ThemeProvider({ children, ...props }) {
    // Function to get the initial sidebar collapsed state from local storage
    const initialCollapsed = () => {
        // Check if window is defined (to avoid issues during server-side rendering)
        if (typeof window !== 'undefined') {
            // Retrieve the saved state from local storage
            const savedState = window.localStorage.getItem('sidebarCollapsed');
            // Parse the saved state or default to false
            return savedState ? JSON.parse(savedState) : false;
        }
        // Default to false if window is not defined (server-side rendering)
        return false;
    };

    // State to manage the sidebar collapsed state
    const [collapsed, setCollapsed] = useState(initialCollapsed);

    // Effect to save the collapsed state to local storage when it changes
    useEffect(() => {
        // Check if window is defined (to avoid issues during server-side rendering)
        if (typeof window !== 'undefined') {
            // Save the collapsed state to local storage
            localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
        }
    }, [collapsed]);

    // Context value containing the collapsed state and setter function
    const contextValue = { collapsed, setCollapsed };

    // Return the ThemeContext.Provider with the NextThemesProvider and children
    return (
        <ThemeContext.Provider value={contextValue}>
            <NextThemesProvider {...props}>{children}</NextThemesProvider>
        </ThemeContext.Provider>
    );
}

// Custom hook for using the theme context
export function useTheme() {
    // Get the current theme context
    const context = useContext(ThemeContext);
    // Throw an error if the hook is used outside of a ThemeProvider
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    // Return the context, which includes the collapsed state and setter function
    return context;
}
