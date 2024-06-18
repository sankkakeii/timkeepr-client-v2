// Import the Firestore database module
import { db } from '@/lib/firebase';
import globalConfig from '@/globalConfig';
import { RoleAndPermissionManagement } from '@/lib/role_management/role-management';


// Function to handle API responses and throw errors if not okay
const handleApiResponse = async (response) => {
    if (!response.ok) {
        const responseText = await response.text();
        throw new Error(responseText);
    }
    return response.json();
};

// Create a logic module for managing team-related actions
export const TeamLogic = () => {

    // Function to create a new team
    const permissionManagement = RoleAndPermissionManagement();
    permissionManagement.compareAndLogRoles()

    /**
 * Asynchronously creates a new team.
 *
 * @param {Object} authUser - the authenticated user object
 * @param {string} teamName - the name of the team to be created
 * @param {string} owner - the owner of the team
 * @param {string} department - the department of the team
 * @return {Promise<Object>} an object containing the result of the team creation
 */
    const createTeam = async (authUser, teamName, owner, department) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('team-management');

            // Check if a team with the same name already exists
            const existingTeamSnapshot = await db.collection(globalConfig.firestoreCollections.teams)
                .where('createdBy', '==', authUser.uid)
                .where('name', '==', teamName)
                .get();

            if (!existingTeamSnapshot.empty) {
                // Return early with an error message
                return { type: 'error', message: 'A team with this name already exists.' };
            }

            // Add the new team
            const newTeamRef = await db.collection(globalConfig.firestoreCollections.teams).add({
                teamName: teamName,
                owner,
                department,
                createdBy: authUser.uid,
                members: [],
                tasks: []
            });

            // Return success with the ID of the newly created team
            return { type: 'success', message: 'Team added successfully!', teamId: newTeamRef.id };
        } catch (error) {
            // Log the error for debugging
            console.error('Error adding team:', error);

            // Return an error message
            return { type: 'error', message: `Error adding team: ${error.message}` };
        }
    };

    // Function to edit team details

    /**
 * Edit a team in the database.
 *
 * @param {string} teamId - The ID of the team to be edited.
 * @param {object} updatedTeamData - The updated data for the team.
 * @return {object} An object with type and message properties.
 */
    const editTeam = async (teamId, updatedTeamData) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('team-management');

            await db.collection(globalConfig.firestoreCollections.teams).doc(teamId).update(updatedTeamData);

            return { type: 'success', message: 'Team successfully updated.' };
        } catch (error) {
            return { type: 'error', message: `Error updating team: ${error.message}` };
        }
    };

    // Function to delete a team

    /**
  * Delete a team using the API endpoint and handle permissions.
  *
  * @param {string} teamId - The ID of the team to be deleted
  * @param {object} activeTeam - The active team object
  * @return {object} An object with type and message properties
  */
    const deleteTeam = async (teamId, activeTeam) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('team-management');

            // Delete the team using the API endpoint
            await handleApiResponse(
                await fetch('/api/team-api/deleteTeam', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ teamId }),
                })
            );

            if (teamId === activeTeam.value.id) {
                localStorage.setItem('activeTeam', null)
            }

            return { type: 'success', message: 'Team successfully deleted.' };

        } catch (error) {
            return { type: 'error', message: `Error deleting team: ${error.message}` };
        }
    };

    // Function to add a user to a team

    /**
 * Add a user to a team.
 *
 * @param {string} teamId - The ID of the team
 * @param {Object} teamInfo - The information about the team
 * @param {string} userId - The ID of the user to be added
 * @return {Object} The result object containing type, message, and data
 */
    const addUserToTeam = async (teamId, teamInfo, userId) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('team-management');

            // Check if team information is available
            if (!teamInfo || !Array.isArray(teamInfo.members)) {
                return { type: 'error', message: 'Team information is not available.' };
            }

            // Check if the user already exists in the team
            if (teamInfo.members.includes(userId)) {
                return { type: 'error', message: 'User already exists in the team.' };
            }

            // Update the team with the new user
            const updatedMembersArray = [...teamInfo.members, userId];
            await db.collection(globalConfig.firestoreCollections.teams).doc(teamId).update({
                members: updatedMembersArray
            });

            return { type: 'success', message: 'User successfully added to the team.', data: updatedMembersArray };

        } catch (error) {
            return { type: 'error', message: `Error adding user to team: ${error.message}` };
        }
    };

    // Function to remove a user from a team

    /**
 * Removes a user from a team.
 *
 * @param {string} teamId - The ID of the team
 * @param {object} teamInfo - The information about the team
 * @param {string} userId - The ID of the user to be removed
 * @return {object} An object containing the type of the result, a message, and optional data
 */
    const removeUserFromTeam = async (teamId, teamInfo, userId) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('team-management');

            // Check if team information or member list is available
            if (!teamInfo || !teamInfo.members) {
                return { type: 'error', message: 'Team information or member list is not available.' };
            }

            // Remove the user from the team
            const updatedMembersArray = [...teamInfo.members];
            const userIndex = updatedMembersArray.indexOf(userId);
            if (userIndex !== -1) {
                updatedMembersArray.splice(userIndex, 1);
            }

            // Update the team with the updated member list
            await db.collection(globalConfig.firestoreCollections.teams).doc(teamId).update({
                members: updatedMembersArray
            });

            return { type: 'success', message: 'User successfully removed from the team.', data: updatedMembersArray };

        } catch (error) {
            return { type: 'error', message: `Error removing user from team: ${error.message}` };
        }
    };

    // Function to fetch teams associated with a user

    /**
 * Fetches teams where the user is a member.
 *
 * @param {string} userId - The ID of the user
 * @return {object} An object containing the type and data of the result
 */
    const fetchUserTeams = async (userId) => {
        try {
            // check permissions

            // Fetch teams where the user is a member
            const userTeams = [];
            const snapshot = await db.collection('teams')
                .where('members', 'array-contains', userId)
                .get();

            // Format the teams data
            snapshot.forEach(doc => {
                userTeams.push({ id: doc.id, ...doc.data() });
            });

            return { type: 'success', data: userTeams };

        } catch (error) {
            return { type: 'error', message: `Error fetching user teams: ${error.message}` };
        }
    };

    // Function to fetch teams created by a user

    /**
 * Fetches teams created by the user.
 *
 * @param {string} userId - The ID of the user
 * @return {object} An object with type and data properties
 */
    const fetchUserCreatedTeams = async (userId) => {
        try {
            // check permissions

            // Fetch teams created by the user
            const createdTeams = [];
            const snapshot = await db.collection(globalConfig.firestoreCollections.teams)
                .where('createdBy', '==', userId)
                .get();

            // Format the teams data
            snapshot.forEach(doc => {
                createdTeams.push({ id: doc.id, ...doc.data() });
            });

            return { type: 'success', data: createdTeams };

        } catch (error) {
            return { type: 'error', message: `Error fetching user created teams: ${error.message}` };
        }
    };


    /**
 * Asynchronously fetches user's teams and created teams while checking permissions.
 *
 * @param {Object} authUser - the authenticated user
 * @param {Function} updateCallback - callback function to update UI with fetched data
 * @return {Object} an object containing type, data, and unsubscribe function
 */
    const fetchUserAndCreatedTeams = async (authUser, updateCallback) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('team-management');

            // Fetch teams where the user is a member
            const userTeamsRef = db.collection(globalConfig.firestoreCollections.teams).where('members', 'array-contains', authUser.uid);

            // Fetch teams created by the user
            const createdTeamsRef = db.collection(globalConfig.firestoreCollections.teams).where('createdBy', '==', authUser.uid);

            const userTeamsUnsubscribe = userTeamsRef.onSnapshot((snapshot) => {
                const userTeams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                updateCallback({ type: 'success', data: { userTeams } });
            });

            const createdTeamsUnsubscribe = createdTeamsRef.onSnapshot((snapshot) => {
                const createdTeams = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                updateCallback({ type: 'success', data: { createdTeams } });
            });

            return {
                type: 'success', data: { userTeams: [], createdTeams: [] }, unsubscribe: () => {
                    userTeamsUnsubscribe();
                    createdTeamsUnsubscribe();
                }
            };

        } catch (error) {
            return { type: 'error', message: `Error fetching teams: ${error.message}` };
        }
    };

    // Return functions for managing team-related actions
    return {
        createTeam,
        editTeam,
        deleteTeam,
        addUserToTeam,
        removeUserFromTeam,
        fetchUserTeams,
        fetchUserCreatedTeams,
        fetchUserAndCreatedTeams
    };
};
