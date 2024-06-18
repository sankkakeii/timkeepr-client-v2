// Import necessary modules and functions
import { useAuth } from '@/context/AuthUserContext';
import { useRouter } from 'next/router';

// Create a logic module for social sign-up related functions
export const SocialSignUpLogic = () => {
    // Access authentication functions for social sign-in
    const { signInWithGoogle, signInWithFacebook, signInWithGithub } = useAuth();
    // Access the Next.js router for navigation
    const router = useRouter();

    // Function to sign up a user using Google authentication
    const signUpWithGoogle = async () => {
        try {
            // Sign up the user using Google authentication
            await signInWithGoogle();
            // Redirect to the sign-in page after successful sign-up
            router.push('/auth/sign-in');
            // Return success message
            return { status: 'success', message: 'Success. The user is created using Google' };
        } catch (error) {
            // Return an error message if an error occurs during the sign-up process
            return { status: 'error', message: error.message };
        }
    };

    // Function to sign up a user using Facebook authentication
    const signUpWithFacebook = async () => {
        try {
            // Sign up the user using Facebook authentication
            await signInWithFacebook();
            // Redirect to the sign-in page after successful sign-up
            router.push('/auth/sign-in');
            // Return success message
            return { status: 'success', message: 'Success. The user is created using Facebook' };
        } catch (error) {
            // Return an error message if an error occurs during the sign-up process
            return { status: 'error', message: error.message };
        }
    };

    // Function to sign up a user using Github authentication
    const signUpWithGithub = async () => {
        try {
            // Sign up the user using Github authentication
            await signInWithGithub();
            // Redirect to the sign-in page after successful sign-up
            router.push('/auth/sign-in');
            // Return success message
            return { status: 'success', message: 'Success. The user is created using Github' };
        } catch (error) {
            // Return an error message if an error occurs during the sign-up process
            return { status: 'error', message: error.message };
        }
    };

    // Return functions for signing up with Google, Facebook, and Github
    return {
        signUpWithGoogle,
        signUpWithFacebook,
        signUpWithGithub,
    };
};
