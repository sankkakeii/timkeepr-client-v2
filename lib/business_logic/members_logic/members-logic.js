// Import necessary modules and functions
import { useAuth } from '@/context/AuthUserContext';
import globalConfig from '@/globalConfig';
import { db } from '@/lib/firebase';
import { RoleAndPermissionManagement } from '@/lib/role_management/role-management';
import { UserLogic } from '@/lib/business_logic/user_logic/user-logic';

// Function to handle API responses and throw errors if not okay
const handleApiResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }
    return response.json();
};


// Create a logic module for managing team members
export const MembersLogic = () => {
    // Access the authenticated user from the authentication context
    const { authUser } = useAuth();
    const permissionManagement = RoleAndPermissionManagement();
    permissionManagement.compareAndLogRoles()
    const userLogic = UserLogic();

    // Function to add an existing user to a team

    /**
 * Add an existing user to a team.
 * @param {string} teamId - The ID of the team.
 * @param {Object} existingUser - The existing user object to be added to the team.
 * @returns {Object} - The status and message of the operation.
 */
    const addExistingUserToTeam = async (teamId, existingUser) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('member-management');

            // Check if the user is authenticated
            if (!authUser) {
                throw new Error('User not authenticated');
            }

            // Access the team document reference
            const teamRef = db.collection(globalConfig.firestoreCollections.teams).doc(teamId);
            const teamSnapshot = await teamRef.get();

            // Check if the team exists
            if (!teamSnapshot.exists) {
                throw new Error('Team not found');
            }

            const teamData = teamSnapshot.data();

            // Check if the user already exists in the 'members' array
            const isUserAlreadyAdded = teamData.members.some(member => member.id === existingUser.id);

            if (isUserAlreadyAdded) {
                return { status: 'error', message: 'User already added to the team.' };
            }

            // If the user doesn't exist, add them to the 'members' array
            const updatedMembers = [...teamData.members, existingUser];

            // Update the 'members' field in the team document
            await teamRef.update({ members: updatedMembers });

            return { status: 'success', message: 'Existing user added successfully.' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Function to invite a user to a team by email

    /**
 * Invite a user to a team by email
 * @param {string} email - User's email
 * @param {string} teamId - Team's ID
 * @param {string} authId - Auth ID
 * @return {object} - Object with status and message
 */
    const inviteUserByEmail = async (email, teamId, authId) => {
        let userRole = globalConfig.roles.user;
        try {
            // Send invitation email
            await handleApiResponse(
                await fetch('/api/utils/sendInvite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, teamId, authId, userRole }),
                })
            )
            let pendingResponse = await userLogic.addPendingUser(email, teamId, authId, userRole);

            return { status: pendingResponse.status, message: pendingResponse.message };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };


    // Function to fetch members of a team by teamId

    /**
 * Fetches members of a team by teamId
 * @param {string} teamId - The ID of the team
 * @returns {Object} - Object containing status and members array
 */
    const fetchMembersByTeamId = async (teamId) => {
        try {
            // Access the team document reference
            const teamRef = db.collection(globalConfig.firestoreCollections.teams).doc(teamId);
            const teamSnapshot = await teamRef.get();

            // Check if the team exists
            if (!teamSnapshot.exists) {
                throw new Error('Team not found');
            }

            // check permissions
            permissionManagement.checkPermissions('member-management');

            const teamData = teamSnapshot.data();

            // Access the 'members' field in the team document, default to an empty array if not present
            const members = teamData.members || [];

            return { status: 'success', members };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Function to edit a member in a team

    /**
 * Updates a member in a team
 * @param {string} teamId - The ID of the team
 * @param {string} memberId - The ID of the member to be updated
 * @param {object} updatedMember - The updated member data
 * @returns {object} - Object containing status and message
 */
    const editMemberInTeam = async (teamId, memberId, updatedMember) => {
        try {
            // Set the id of the updated member
            updatedMember.id = memberId;

            // Check if the user is authenticated
            if (!authUser) {
                throw new Error('User not authenticated');
            }

            // check permissions
            permissionManagement.checkPermissions('member-management');

            // Use a Firestore transaction to ensure consistency
            await db.runTransaction(async (transaction) => {
                const teamRef = db.collection(globalConfig.firestoreCollections.teams).doc(teamId);
                const teamSnapshot = await transaction.get(teamRef);

                // Check if the team exists
                if (!teamSnapshot.exists) {
                    throw new Error('Team not found');
                }

                const teamData = teamSnapshot.data();

                // Update the 'members' field by mapping over existing members
                const updatedMembers = teamData.members.map((member) =>
                    member.id === memberId ? { ...member, ...updatedMember } : member
                );

                // Update the team document with the modified 'members' field
                transaction.update(teamRef, { members: updatedMembers });
            });

            return { status: 'success', message: 'Member updated successfully.' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Function to delete a member from a team

    /**
 * Deletes a member from a team
 * @param {string} teamId - The ID of the team
 * @param {string} memberId - The ID of the member to be deleted
 * @returns {Object} - Object containing status and message
 */
    const deleteMemberInTeam = async (teamId, memberId) => {
        try {
            // Check if the user is authenticated
            if (!authUser) {
                throw new Error('User not authenticated');
            }

            // check permissions
            permissionManagement.checkPermissions('member-management');

            // Use a Firestore transaction to ensure consistency
            await db.runTransaction(async (transaction) => {
                const teamRef = db.collection(globalConfig.firestoreCollections.teams).doc(teamId);
                const teamSnapshot = await transaction.get(teamRef);

                // Check if the team exists
                if (!teamSnapshot.exists) {
                    throw new Error('Team not found');
                }

                const teamData = teamSnapshot.data();

                // Remove the member with the specified id from the 'members' array
                const updatedMembers = teamData.members.filter((member) =>
                    member.id !== memberId
                );

                // Update the team document with the modified 'members' field
                transaction.update(teamRef, { members: updatedMembers });
            });

            return { status: 'success', message: 'Member deleted successfully.' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Return functions for managing team members
    return {
        addExistingUserToTeam,
        inviteUserByEmail,
        fetchMembersByTeamId,
        editMemberInTeam,
        deleteMemberInTeam
    };
};
