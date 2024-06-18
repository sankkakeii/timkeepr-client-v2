// Import necessary modules and functions
import { useAuth } from '@/context/AuthUserContext';
import { OrganizationLogic } from '../organization_logic/organization_logic';

// Create a logic module for sign-up related functions
export const SignUpLogic = () => {
    // Access authentication function for user creation
    const { createUserWithEmailAndPassword } = useAuth();
    const organizationLogic = OrganizationLogic();

    // Function to create a default organization for a newly signed-up user
    const createDefaultOrganization = async (uid) => {
        try {
            // Add a default organization to the 'organizations' collection
            await organizationLogic.createDefaultOrganization(uid);

            // Return success message if organization creation is successful
            return { status: 'success', message: 'User created successfully.' };
        } catch (error) {
            // Log and return an error message if organization creation fails
            console.error(error);
            return { status: 'error', message: error.message };
        }
    };

    // Function to handle the sign-up process
    const signUp = async (email, password) => {
        try {
            // Attempt to create a user with email and password
            const createdAuthUser = await createUserWithEmailAndPassword(email, password);
            const userUID = createdAuthUser.data.uid;

            // Check if user creation was successful
            if (userUID) {
                // Create a default organization for the new user
                const result = await createDefaultOrganization(userUID);


                // Return the result along with the user's UID
                return { ...result, uid: createdAuthUser.uid };
            } else {
                // Return an error message if user creation fails
                return { status: 'error', message: 'User creation failed.' };
            }
        } catch (error) {
            // Log and return an error message for any unexpected errors
            console.error(error);
            return { status: 'error', message: error.message };
        }
    };

    // Return the signUp function for use in components
    return {
        signUp,
    };
};
