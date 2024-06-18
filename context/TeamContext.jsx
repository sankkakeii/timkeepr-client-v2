// Import necessary modules from React
import { createContext, useState, useContext, useEffect } from 'react';

// Create a context for managing team-related state
const TeamContext = createContext();

// Define a provider component for the team context
export function TeamProvider({ children }) {
    // State to track the active team
    const [activeTeam, setActiveTeam] = useState(null);

    // useEffect to initialize the active team from localStorage on component mount
    useEffect(() => {
        // Retrieve the active team from localStorage
        const storedTeam = localStorage.getItem('activeTeam');

        try {
            // Attempt to parse the stored team as JSON
            const parsedTeam = JSON.parse(storedTeam);

            // Set the active team in state
            setActiveTeam(parsedTeam);
        } catch (error) {
            // Log an error if parsing fails
            console.error('Error parsing activeTeam:', error);

            // Handle the error or set a default value
            // setActiveTeam(/* Default value or handle the error */);
        }
    }, []);

    // Function to set the active team and update localStorage
    const setTeam = (team) => {
        setActiveTeam(team);
        localStorage.setItem('activeTeam', JSON.stringify(team));
    };

    // Provide the team context value to the children components
    return (
        <TeamContext.Provider value={{ activeTeam, setTeam }}>
            {children}
        </TeamContext.Provider>
    );
}

// Custom hook to conveniently access team context
export function useTeam() {
    // Access the team context
    const context = useContext(TeamContext);

    // Throw an error if used outside of a TeamProvider
    if (context === undefined) {
        throw new Error('useTeam must be used within a TeamProvider');
    }

    // Return the context for easy access in components
    return context;
}
