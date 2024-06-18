// Import necessary modules and functions
import { useAuth } from '@/context/AuthUserContext';
import { useRouter } from 'next/router';
import { db, storage } from '@/lib/firebase';
import globalConfig from '@/globalConfig';

// Create a logic module for social sign-in related functions
export const SocialSignInLogic = () => {
    // Access authentication functions for social sign-in
    const { signInWithGoogle, signInWithFacebook, signInWithGithub } = useAuth();
    // Access the Next.js router for navigation
    const router = useRouter();

    // Function to get the user's role based on email
    const getUserRole = async (email) => {
        try {
            // Query the 'users' collection for the user with the given email
            const userSnapshot = await db.collection(globalConfig.firestoreCollections.users).where('email', '==', email).get();
            // Check if the user exists in the collection
            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                // Return the user's role from the document data
                return userDoc.data().role;
            } else {
                // Throw an error if the user is not found in the users collection
                throw new Error(`User not found in the ${globalConfig.firestoreCollections.users} collection.`);
            }
        } catch (error) {
            // Return an error message if an error occurs during the process
            return { status: 'error', message: error.message };
        }
    };

    // Function to get the user's profile image URL and store it in local storage
    const getUserProfileImage = async (userId) => {
        try {
            // Get the download URL for the user's profile image from Firebase Storage
            const imageUrl = await storage.ref(`profile_images/${userId}`).getDownloadURL();
            // Store the image URL in local storage
            localStorage.setItem('user-profile-image', imageUrl);
        } catch (error) {
            // Return an error message if an error occurs during the process
            return { status: 'error', message: error.message };
        }
    };

    // Function to handle the sign-in process with a given provider function
    const signInWithProvider = async (signInFunction) => {
        try {
            // Sign in using the provided social sign-in function
            const authUser = await signInFunction();

            // Get the user's profile image URL and store it in local storage
            await getUserProfileImage(authUser.uid);

            return { status: 'success', message: 'Login successful.', data: {
                authUser: authUser
            }};
        } catch (error) {
            // Return an error message if an error occurs during the process
            return { status: 'error', message: error.message };
        }
    };

    // Return functions for signing in with Google, Facebook, and Github
    return {
        signInWithGoogle: () => signInWithProvider(signInWithGoogle),
        signInWithFacebook: () => signInWithProvider(signInWithFacebook),
        signInWithGithub: () => signInWithProvider(signInWithGithub),
    };
};
