// Import necessary modules and functions
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/context/AuthUserContext';
import globalConfig from '@/globalConfig';
import { OrganizationLogic } from '../organization_logic/organization_logic';
import { RoleAndPermissionManagement } from '@/lib/role_management/role-management';

// Function to handle API responses and throw errors if not okay
const handleApiResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
};

// Function to generate a random password
const getRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 8;
    let password = "";

    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
}

// Function to delete user profile image
/**
 * Deletes the user profile image.
 * 
 * @param {string} userId - The ID of the user whose profile image will be deleted.
 * @returns {Object} - An object containing the status of the operation and a message.
 */
const deleteProfileImage = async (userId) => {
    try {
        // Reference to the profile image in storage
        const storageRef = storage.ref().child(`profile_images/${userId}`);

        // Delete the profile image
        await storageRef.delete();

        return { status: 'success', message: 'Profile image successfully deleted.' };
    } catch (error) {
        return { status: 'error', message: `Error deleting profile image: ${error.message}` };
    }
};


// Create a logic module for managing user-related actions
export const UserLogic = () => {
    // Access the authenticated user and updateAuthUser function from the authentication context
    const { authUser, updateAuthUser } = useAuth();
    const organizationLogic = OrganizationLogic();
    const permissionManagement = RoleAndPermissionManagement();
    permissionManagement.compareAndLogRoles()


    // Function to add a new user
    /**
 * Function to add a new user
 * 
 * @param {string} firstname - The first name of the user
 * @param {string} lastname - The last name of the user
 * @param {string} name - The full name of the user
 * @param {string} email - The email address of the user
 * @param {object} role - The role object of the user
 * @returns {object} - The status and message of the operation
 */
    const addUser = async (firstname, lastname, name, email, role) => {
        let roleData = role.data;
        try {
            // check permissions
            permissionManagement.checkPermissions('user-management');

            // Generate a random password
            const password = getRandomPassword();

            // Create a user in the authentication system using the API endpoint
            const data = await handleApiResponse(
                await fetch('/api/profile-api/createUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                })
            );

            if (data) {
                // send default authentication email
                await handleApiResponse(
                    await fetch('/api/utils/sendDefaultAuth', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    })
                );
            }

            // Create a user object to store in the organization's users array
            const userObject = {
                name: `${firstname} ${lastname}`,
                id: data.uid,
            };

            // Create a user profile in the users collection
            await db.collection(globalConfig.firestoreCollections.users).doc(data.uid).set({
                firstname,
                lastname,
                name,
                email,
                role: roleData,
                isNewUser: true,
                status: 'active',
                createdBy: authUser.uid,
                // stored in the database for testing purposes, make sure to remove this line
                defaultAccess: password
            });

            // create a default organization for the new user
            await organizationLogic.createDefaultOrganization(data.uid);

            // create a default organization for the new user if user is admin
            // if (role.key === 'admin') {
            //     await organizationLogic.createDefaultOrganization(data.uid);
            // }

            // Update the default auth user's organization users array with the new user
            const orgRef = db.collection(globalConfig.firestoreCollections.organizations).where("createdBy", "==", authUser.uid);
            const orgSnapshot = await orgRef.get();
            if (orgSnapshot.empty) {
                throw new Error("No organizations found for this user");
            }

            const orgData = orgSnapshot.docs.find(doc => doc.data().name === 'default');
            if (orgData) {
                await db.collection(globalConfig.firestoreCollections.organizations).doc(orgData.id).update({
                    users: [...orgData.data().users, userObject]
                });
            }

            return { status: 'success', message: 'User added successfully!' };

        } catch (error) {
            return { status: 'error', message: `Error adding user: ${error.message}` };
        }
    };



    const getUserById = async (userId) => {
        try {
            const userDoc = await db.collection(globalConfig.firestoreCollections.users).doc(userId).get();
            if (userDoc.exists) {
                // Return the user data
                return userDoc.data();
            } else {
                throw new Error(`User with ID ${userId} not found in the users collection.`);
            }
        } catch (error) {
            return { status: 'Error', message: 'Error fetching user by ID', error: error };
        }
    };


    // Function to delete a user
    /**
 * Deletes a user and related data from the system.
 * 
 * @param {string} userId - The ID of the user to be deleted.
 * @returns {Object} - Object containing the status and message of the deletion process.
 */
    const deleteUser = async (userId) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('user-management');

            // Fetch user data before deletion
            const userDocRef = db.collection(globalConfig.firestoreCollections.users).doc(userId);
            const userSnapshot = await userDocRef.get();
            const userData = userSnapshot.data();

            // Check if the user has the role of 'superuser'
            if (userData.role === 'superuser') {
                return { status: 'error', message: 'Cannot delete a superuser.' };
            }

            // Delete user from the authentication system using the API endpoint
            await handleApiResponse(
                await fetch('/api/profile-api/deleteUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                })
            );

            // Delete user profile from the users collection
            await handleApiResponse(
                await fetch('/api/profile-api/deleteUserProfile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                })
            );

            // Purge user data from organizations created by the current user
            const orgRef = db.collection(globalConfig.firestoreCollections.organizations).where("createdBy", "==", authUser.uid);
            const orgSnapshot = await orgRef.get();

            const batch = db.batch();

            orgSnapshot.forEach(async (doc) => {
                const orgData = doc.data();

                if (orgData.users) {
                    // Remove the deleted user from the users array
                    const updatedUsers = orgData.users.filter(user => user.id !== userId);

                    // Update the organization document
                    batch.update(doc.ref, { users: updatedUsers });
                }
            });

            // Commit the batch operation
            await batch.commit();

            // Delete the user's profile image
            await deleteProfileImage(userId);


            // Delete user organization
            await handleApiResponse(
                await fetch('/api/organization-api/deleteOrganization', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }),
                })
            );


            return { status: 'success', message: 'User successfully deleted.' };
        } catch (error) {
            return { status: 'error', message: `Error deleting user: ${error.message}` };
        }
    };



    // Function to fetch users associated with the current user's organizations

    /**
 * Fetches users associated with the current user's organizations
 * @returns {Object} Object with status and data properties
 */
    const getUsers = async () => {
        try {
            // check permissions
            permissionManagement.checkPermissions('user-management');

            const orgRef = db.collection(globalConfig.firestoreCollections.organizations).where("createdBy", "==", authUser.uid);
            const orgSnapshot = await orgRef.get();

            if (orgSnapshot.empty) {
                throw new Error("No organizations found for this user");
            }

            const orgData = orgSnapshot.docs.find(doc => doc.data().name === 'default');

            if (orgData) {
                const users = orgData.data().users;
                return { status: 'success', data: users };
            } else {
                throw new Error("No default organization found");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            return { status: 'error', message: `Error fetching users: ${error.message}` };
        }
    };

    // Function to update user profile data

    /**
    * Update user profile data
    * @param {string} userId - The ID of the user to update
    * @param {object} updatedData - The updated user profile data
    * @returns {object} - Object containing status, message, and updated user profile data
    */
    const updateUserProfile = async (userId, updatedData) => {
        try {
            // check permissions
            permissionManagement.checkPermissions(['user-management', 'self-management']);

            // Update user profile in the users collection
            await db.collection(globalConfig.firestoreCollections.users).doc(userId).update(updatedData);

            // Fetch the updated user profile from the users collection
            const updatedUserProfileSnapshot = await db.collection(globalConfig.firestoreCollections.users).doc(userId).get();
            const updatedUserProfile = updatedUserProfileSnapshot.data();

            // Update authUser.data with the new/updated user profile information
            const updatedAuthUser = {
                uid: authUser.uid,
                data: updatedUserProfile,
            };
            updateAuthUser(updatedAuthUser);

            return { status: 'success', message: 'User profile updated successfully!', data: updatedAuthUser };
        } catch (error) {
            console.log(error.message)
            return { status: 'error', message: `Error updating user profile: ${error.message}` };
        }
    };

    // Function to upload user profile image to Firebase storage

    /**
     * Uploads user profile image to Firebase storage
     * @param {File} file - The file to be uploaded
     * @returns {Promise<string>} - The download URL of the uploaded image
     */
    const uploadImageToFirebase = async (file) => {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`profile_images/${authUser.uid}`);
        const snapshot = await imageRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        return downloadURL;
    };


    // Function to add pending user to database

    /**
     * Add a pending user to the database
     * @param {string} email - The email of the user to be added
     * @param {string} teamId - The ID of the team the user belongs to
     * @param {string} authId - The ID of the user performing the action
     * @param {string} userRole - The role of the user
     * @returns {object} - Object with status and message properties
     */
    const addPendingUser = async (email, teamId, authId, userRole) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('user-management');

            // Check if the user with the same email and teamId already exists
            const existingUserQuery = await db.collection(globalConfig.firestoreCollections.pendingUsers)
                .where('email', '==', email)
                .where('teamId', '==', teamId)
                .get();

            if (!existingUserQuery.empty) {
                // If the user exists, update the date to the current date
                const existingUserDoc = existingUserQuery.docs[0];
                await existingUserDoc.ref.update({
                    date: new Date() // Update the date to the current date
                });

                return { status: 'Alert', message: 'Invite Sent Already!.' };
            } else {
                // If the user doesn't exist, add them to the pendingUsers collection with the current date
                const currentDate = new Date();
                await db.collection(globalConfig.firestoreCollections.pendingUsers).add({
                    email: email,
                    createdBy: authId,
                    teamId: teamId,
                    role: userRole,
                    status: 'pending',
                    date: currentDate
                });

                return { status: 'success', message: 'Added pending user successfully!' };
            }
        } catch (error) {
            console.error('Error adding pending user to the database:', error);
            return { status: 'error', message: `Error adding pending user to the database: ${error.message}` };
        }
    };


    // Function to check the status of a user document

    /**
     * Function to check the status of a user document.
     * @param {string} userId - The ID of the user document to check.
     * @returns {Promise<{status: string, data: {userId: string, status: string}}>} - The status of the user document.
     */
    const checkUserStatus = async (userId) => {
        try {
            // Fetch user data from the usersProfile collection
            const userDocRef = db.collection(globalConfig.firestoreCollections.users).doc(userId);
            const userSnapshot = await userDocRef.get();

            if (!userSnapshot.exists) {
                throw new Error('User not found');
            }

            const userData = userSnapshot.data();
            const userStatus = userData.status;

            return { status: 'success', data: { userId, status: userStatus } };
        } catch (error) {
            return { status: 'error', message: `Error checking user status: ${error.message}` };
        }
    };

    // Function to update the status of a user document

    /**
     * Update the status of a user document
     * @param {string} userId - The ID of the user document
     * @param {string} newStatus - The new status to update
     * @returns {Object} - Object with status, message, and data properties
     */
    const updateUserStatus = async (userId, newStatus) => {
        try {
            // Validate newStatus
            const allowedStatusValues = ['active', 'pending', 'inactive', 'disabled'];
            if (!allowedStatusValues.includes(newStatus)) {
                throw new Error(`Invalid status value. Allowed values are: ${allowedStatusValues.join(', ')}`);
            }

            // Update user status in the usersProfile collection
            await db.collection(globalConfig.firestoreCollections.users).doc(userId).update({
                status: newStatus
            });

            return { status: 'success', message: 'User status updated successfully!', data: { userId, status: newStatus } };
        } catch (error) {
            return { status: 'error', message: `Error updating user status: ${error.message}` };
        }
    };



    // Return functions for managing user-related actions
    return {
        authUser,
        addUser,
        getUserById,
        deleteUser,
        getUsers,
        updateUserProfile,
        uploadImageToFirebase,
        addPendingUser,
        checkUserStatus,
        updateUserStatus
    };
};
