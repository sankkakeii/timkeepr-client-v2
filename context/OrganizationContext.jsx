// Import necessary modules from React
import { createContext, useState, useContext, useEffect } from 'react';
import { db } from '@/lib/firebase';
import globalConfig from '@/globalConfig';

// Create a context for managing organization-related state
const OrganizationContext = createContext();

// Define a provider component for the organization context
export function OrganizationProvider({ children }) {
    // State to track the active organization
    const [activeOrganization, setActiveOrganization] = useState(null);

    // useEffect to initialize the active organization from localStorage on component mount
    useEffect(() => {
        // Retrieve the active organization from localStorage
        const storedOrg = localStorage.getItem('activeOrganization');

        try {
            // Attempt to parse the stored team as JSON
            const parsedOrg = JSON.parse(storedOrg);

            // Set the active org in state
            setActiveOrganization(parsedOrg);
        } catch (error) {
            // Log an error if parsing fails
            console.error('Error parsing activeOrg:', error);

            // Handle the error or set a default value
            // setActiveTeam(/* Default value or handle the error */);
        }
    }, []);

    // Function to refresh the active organization data
    const refreshOrganizationData = async (userId) => {
        try {
            // Fetch organizations where the user created the organization(s)
            const userOrganizations = [];
            const snapshot = await db.collection(globalConfig.firestoreCollections.organizations)
                .where('createdBy', '==', userId)
                .get();

            // Format the organizations data
            snapshot.forEach(doc => {
                userOrganizations.push({ id: doc.id, ...doc.data() });
            });

            // Update the active organization in state
            if (userOrganizations.length > 0) {
                const updatedOrganization = userOrganizations[0]; // Assuming you want to update with the first organization
                setActiveOrganization(updatedOrganization);

                // Update localStorage with the new organization data
                localStorage.setItem('activeOrganization', JSON.stringify(updatedOrganization));

                return { type: 'success', data: updatedOrganization };
            } else {
                return { type: 'error', message: 'User is not a member of any organizations.' };
            }

        } catch (error) {
            return { type: 'error', message: `Error refreshing user organizations: ${error.message}` };
        }
    };

    // Function to update localStorage when active organization changes
    const setOrganization = (organization) => {
        setActiveOrganization(organization);
        localStorage.setItem('activeOrganization', JSON.stringify(organization));
    };

    // Provide the organization context value to the children components
    return (
        <OrganizationContext.Provider value={{ activeOrganization, setOrganization, refreshOrganizationData }}>
            {children}
        </OrganizationContext.Provider>
    );
}

// Custom hook to conveniently access organization context
export function useOrganization() {
    // Access the organization context
    const context = useContext(OrganizationContext);

    // Throw an error if used outside of an OrganizationProvider
    if (context === undefined) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }

    // Return the context for easy access in components
    return context;
}
