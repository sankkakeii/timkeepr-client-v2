// Import necessary modules and functions
import { useAuth } from '@/context/AuthUserContext';
import { db, storage } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { useToast } from "@/components/ui/use-toast";
import globalConfig from '@/globalConfig';
import { useOrganization } from '@/context/OrganizationContext';
import { OrganizationLogic } from '../organization_logic/organization_logic';

// Create a logic module for sign-in related functions
export const SignInLogic = () => {
    // Access Next.js router and authentication functions
    const router = useRouter();
    const { signInWithEmailAndPassword } = useAuth();
    const { toast } = useToast();
    const { setOrganization } = useOrganization(); // Use the organization context
    const organizationLogic = OrganizationLogic(); // Initialize organization logic module

    // Function to retrieve the user's role from the users collection
    const getUserRole = async (email) => {
        try {
            const userSnapshot = await db.collection(globalConfig.firestoreCollections.users).where('email', '==', email).get();
            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                return userDoc.data().role;
            } else {
                throw new Error(`User not found in the ${globalConfig.firestoreCollections.users} collection.`);
            }
        } catch (error) {
            // Display a toast notification for any errors
            toast({ title: "Error", description: error.message });
        }
    };

    // Function to retrieve and store the user's profile image URL
    const getUserProfileImage = async (userId) => {
        try {
            const imageUrl = await storage.ref(`profile_images/${userId}`).getDownloadURL();
            localStorage.setItem('user-profile-image', imageUrl);
        } catch (error) {
            // Display a toast notification for any errors
            toast({ title: "Error", description: error.message });
        }
    };

    // Function to handle the sign-in process
    const signIn = async (email, password) => {
        try {
            const authUser = await signInWithEmailAndPassword(email, password);
            const userRole = await getUserRole(email);

            // Fetch organizations and set active organization if available
            const { data: userOrganizations } = await organizationLogic.fetchUserOrganizations(authUser.data.uid);

            if (userOrganizations.length > 0) {
                localStorage.setItem('activeOrganization', JSON.stringify(userOrganizations[0]));
                setOrganization(userOrganizations[0]); // Set the first organization as active
            }

            if (authUser) {
                await getUserProfileImage(authUser.data.uid);

                let redirectPath = '';

                if (userRole.key === 'superuser' || userRole.key === 'admin') {
                    if (authUser.data.isNewUser) {
                        // Fetch user document and update isNewUser status and display onboarding page
                        const userDocRef = db.collection(globalConfig.firestoreCollections.users).doc(authUser.data.uid);
                        await userDocRef.update({ isNewUser: false });

                        redirectPath = '/admin-onboarding';
                    } else {
                        redirectPath = '/_admin/dashboard';
                    }
                } else if (userRole.key === 'user') {
                    if (authUser.data.isNewUser) {
                        // Fetch user document and update isNewUser status and display onboarding page
                        const userDocRef = db.collection(globalConfig.firestoreCollections.users).doc(authUser.data.uid);
                        await userDocRef.update({ isNewUser: false });

                        redirectPath = '/user-onboarding';
                    } else {
                        redirectPath = `/_profile/${authUser.data.uid}`;
                    }
                }

                router.push(redirectPath);

                return { status: 'success', message: 'Login successful.' };
            } else {
                return { status: 'error', message: 'Authentication failed.' };
            }
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Return the signIn function for use in components
    return {
        signIn,
    };
};
