// Import the Firestore database module
import { db } from '@/lib/firebase';
import globalConfig from '@/globalConfig';
import { RoleAndPermissionManagement } from '@/lib/role_management/role-management';


// Create a logic module for managing organization-related actions
export const OrganizationLogic = () => {
    const permissionManagement = RoleAndPermissionManagement();
    permissionManagement.compareAndLogRoles()


    // Function to create a new organization

/**
 * Creates a new organization by a super user.
 * 
 * @param {Object} authUser - The authenticated user object.
 * @param {string} organizationName - The name of the organization to be created.
 * @param {string} owner - The owner of the organization.
 * @param {string} department - The department of the organization.
 * @returns {Object} - An object with the result of the organization creation.
 */
    const createOrganizationBySuperUser = async (authUser, organizationName, owner, department) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');


            // Check if an organization with the same name already exists
            const existingOrganizationSnapshot = await db.collection(globalConfig.firestoreCollections.organizations)
                .where('createdBy', '==', authUser.uid)
                .where('name', '==', organizationName)
                .get();

            if (!existingOrganizationSnapshot.empty) {
                // Return early with an error message
                return { type: 'error', message: 'An organization with this name already exists.' };
            }

            // Add the new organization
            const newOrganizationRef = await db.collection(globalConfig.firestoreCollections.organizations).add({
                name: organizationName,
                owner,
                department,
                createdBy: authUser.uid,
                users: [],
                // Add any other relevant fields for organizations
            });

            // Return success with the ID of the newly created organization
            return { type: 'success', message: 'Organization added successfully!', organizationId: newOrganizationRef.id };
        } catch (error) {
            // Log the error for debugging
            console.error('Error adding organization:', error);

            // Return an error message
            return { type: 'error', message: `Error adding organization: ${error.message}` };
        }
    };


    // Function to create a default organization

    /**
 * Creates a default organization with predefined settings and permissions.
 * @param {Object} authUser - The authenticated user object
 * @returns {Object} - Object containing the result of the operation
 */
    const createDefaultOrganization = async (authUser) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Add the new organization
            const newOrganizationRef = await db.collection(globalConfig.firestoreCollections.organizations).add(
                {
                    name: 'default',
                    createdBy: authUser,
                    users: [],
                    department: 'default',
                    owner: 'default',
                    tag: 'default',
                    roles: {
                        admin: {
                            label: "Administrator",
                            key: "admin",
                            description: "Full access to all features",
                            weight: 1,
                            permissions: [
                                "user-management",
                                "team-management",
                                "task-management",
                                "member-management",
                                "organization-settings",
                                // Additional dynamic permissions can be added here
                            ],
                        },
                        superuser: {
                            label: "Superuser",
                            key: "superuser",
                            description: "Extended permissions beyond admin",
                            weight: 0,
                            inherits: ["admin", "user"],
                            permissions: [
                                "superuser-permissions",
                            ],
                        },
                        user: {
                            label: "User",
                            key: "user",
                            description: "Basic user with limited access",
                            weight: 2,
                            permissions: [
                                "self-management",
                                "task-read",
                                // Additional dynamic permissions can be added here
                            ],
                        },
                    },
                    permissionsList: [
                        "user-management",
                        "user-read",
                        "team-management",
                        "team-read",
                        "task-management",
                        "task-read",
                        "member-management",
                        "member-read",
                        "organization-settings",
                        "organization-read",
                        "superuser-permissions",
                        "self-management",
                    ],

                    extendedPermissionsList: [
                        "user-management",
                        "team-management",
                        "task-management",
                        "member-management",
                        "organization-settings",
                        "superuser-permissions",
                        "self-management",
                        "task-read",

                        // An Idea for potential dynamic permissions
                        "addTaskToTeam",
                        "editTaskInTeam",
                        "fetchTasksByTeamId",
                        "deleteTaskInTeam",
                        "addExistingUserToTeam",
                        "inviteUserByEmail",
                        "fetchMembersByTeamId",
                        "editMemberInTeam",
                        "deleteMemberInTeam",
                        "createDefaultOrganization",
                        "createOrganizationBySuperUser",
                        "editOrganization",
                        "deleteOrganization",
                        "addUserToOrganization",
                        "removeUserFromOrganization",
                        "fetchUserOrganizations",
                        "fetchUserInOrganization",
                        "fetchUserCreatedOrganizations",
                        "fetchUserAndCreatedOrganizations",
                        "addOrganizationRole",
                        "createTeam",
                        "editTeam",
                        "deleteTeam",
                        "addUserToTeam",
                        "removeUserFromTeam",
                        "fetchUserTeams",
                        "fetchUserCreatedTeams",
                        "fetchUserAndCreatedTeams",
                        "authUser",
                        "addUser",
                        "deleteUser",
                        "getUsers",
                        "updateUserProfile",
                        "uploadImageToFirebase"
                    ]
                });

            // Return success with the ID of the newly created organization
            return { type: 'success', message: 'Organization added successfully!', organizationId: newOrganizationRef.id };
        } catch (error) {
            // Log the error for debugging
            console.error('Error adding organization:', error);

            // Return an error message
            return { type: 'error', message: `Error adding organization: ${error.message}` };
        }
    };

    // Function to edit organization details

    /**
 * Edit organization data in the database
 * @param {string} organizationId - The ID of the organization to be updated
 * @param {object} updatedOrganizationData - The updated data for the organization
 * @returns {object} - An object containing the result of the operation and a message
 */
    const editOrganization = async (organizationId, updatedOrganizationData) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).update(updatedOrganizationData);

            return { type: 'success', message: 'Organization successfully updated.' };
        } catch (error) {
            return { type: 'error', message: `Error updating organization: ${error.message}` };
        }
    };

    // Function to delete an organization

    /**
 * Delete the organization with the given organizationId.
 * @param {string} organizationId - The ID of the organization to delete.
 * @param {object} activeOrganization - The active organization object.
 * @returns {object} - Object containing type and message properties.
 */
    const deleteOrganization = async (organizationId, activeOrganization) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Delete the organization using the API endpoint or Firestore
            // Adjust the logic based on your specific implementation

            if (organizationId === activeOrganization.value.id) {
                localStorage.setItem('activeOrganization', null);
            }

            return { type: 'success', message: 'Organization successfully deleted.' };

        } catch (error) {
            return { type: 'error', message: `Error deleting organization: ${error.message}` };
        }
    };

    // Function to add a user to an organization

    /**
 * Delete the organization with the given organizationId.
 * @param {string} organizationId - The ID of the organization to delete.
 * @param {object} activeOrganization - The active organization object.
 * @returns {object} - Object containing type and message properties.
 */
    const addUserToOrganization = async (organizationId, organizationInfo, userId) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Check if organization information is available
            if (!organizationInfo || !Array.isArray(organizationInfo.members)) {
                return { type: 'error', message: 'Organization information is not available.' };
            }

            // Check if the user already exists in the organization
            if (organizationInfo.members.includes(userId)) {
                return { type: 'error', message: 'User already exists in the organization.' };
            }

            // Update the organization with the new user
            const updatedMembersArray = [...organizationInfo.members, userId];
            await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).update({
                members: updatedMembersArray
                // Add any other relevant fields to update
            });

            return { type: 'success', message: 'User successfully added to the organization.', data: updatedMembersArray };

        } catch (error) {
            return { type: 'error', message: `Error adding user to organization: ${error.message}` };
        }
    };

    // Function to remove a user from an organization

    /**
 * Removes a user from an organization
 * @param {string} organizationId - The ID of the organization
 * @param {object} organizationInfo - The information of the organization
 * @param {string} userId - The ID of the user to be removed
 * @returns {object} - Object containing type, message, and data properties
 */
    const removeUserFromOrganization = async (organizationId, organizationInfo, userId) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Check if organization information or member list is available
            if (!organizationInfo || !organizationInfo.members) {
                return { type: 'error', message: 'Organization information or member list is not available.' };
            }

            // Remove the user from the organization
            const updatedMembersArray = [...organizationInfo.members];
            const userIndex = updatedMembersArray.indexOf(userId);
            if (userIndex !== -1) {
                updatedMembersArray.splice(userIndex, 1);
            }

            // Update the organization with the updated member list
            await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).update({
                members: updatedMembersArray
                // Add any other relevant fields to update
            });

            return { type: 'success', message: 'User successfully removed from the organization.', data: updatedMembersArray };

        } catch (error) {
            return { type: 'error', message: `Error removing user from organization: ${error.message}` };
        }
    };

    // Function to fetch organizations associated with a user

     /**
     * Fetches organizations where the user is a member.
     *
     * @param {string} userId - The ID of the user
     * @return {Object} An object with type and data properties
     */
    const fetchUserOrganizations = async (userId) => {
        try {
            // Fetch organizations where the user is a member
            const userOrganizations = [];
            const snapshot = await db.collection(globalConfig.firestoreCollections.organizations)
                .where('createdBy', '==', userId)
                .get();

            // Format the organizations data
            snapshot.forEach(doc => {
                userOrganizations.push({ id: doc.id, ...doc.data() });
            });

            return { type: 'success', data: userOrganizations };

        } catch (error) {
            return { type: 'error', message: `Error fetching user organizations: ${error.message}` };
        }
    };

    /**
 * Fetches the organizations where the user is a member
 * @param {string} userId - The ID of the user
 * @returns {Object} An object with the type and data of the result
 */
    const fetchUserInOrganization = async (userId) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Fetch organizations where the user is a member
            const userOrganizations = [];
            const snapshot = await db.collection(globalConfig.firestoreCollections.organizations)
                .where('users', 'array-contains', userId)
                .get();

            // Format the organizations data
            snapshot.forEach(doc => {
                userOrganizations.push({ id: doc.id, ...doc.data() });
            });

            return { type: 'success', data: userOrganizations };

        } catch (error) {
            return { type: 'error', message: `Error fetching user in organization: ${error.message}` };
        }
    };

    // Function to fetch organizations created by a user

    /**
 * Fetches organizations created by a user
 * @param {string} userId - The user's ID
 * @returns {Object} - Object containing type and data properties
 */
    const fetchUserCreatedOrganizations = async (userId) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Fetch organizations created by the user
            const createdOrganizations = [];
            const snapshot = await db.collection(globalConfig.firestoreCollections.organizations)
                .where('createdBy', '==', userId)
                .get();

            // Format the organizations data
            snapshot.forEach(doc => {
                createdOrganizations.push({ id: doc.id, ...doc.data() });
            });

            return { type: 'success', data: createdOrganizations };

        } catch (error) {
            return { type: 'error', message: `Error fetching user created organizations: ${error.message}` };
        }
    };

    // Function to fetch user and created organizations

        /**
     * Fetches user organizations and organizations created by the user.
     *
     * @param {Object} authUser - the authenticated user
     * @param {Function} updateCallback - callback function to update user organizations and created organizations
     * @return {Object} an object with type and data properties, including user organizations, created organizations, and an unsubscribe function
     */
    const fetchUserAndCreatedOrganizations = async (authUser, updateCallback) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Fetch organizations where the user is a member in the user's array
            const userOrganizationsRef = db.collection(globalConfig.firestoreCollections.organizations).where('users', 'array-contains', authUser.uid);

            const userOrganizationsUnsubscribe = userOrganizationsRef.onSnapshot((snapshot) => {
                const userOrganizations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                updateCallback({ type: 'success', data: { userOrganizations } });
            });



            // Fetch organizations created by the user
            const createdOrganizationsRef = db.collection(globalConfig.firestoreCollections.organizations).where('createdBy', '==', authUser.uid);


            const createdOrganizationsUnsubscribe = createdOrganizationsRef.onSnapshot((snapshot) => {
                const createdOrganizations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                updateCallback({ type: 'success', data: { createdOrganizations } });
            });

            return {
                type: 'success', data: { userOrganizations: [], createdOrganizations: [] }, unsubscribe: () => {
                    userOrganizationsUnsubscribe();
                    createdOrganizationsUnsubscribe();
                }
            };

        } catch (error) {
            return { type: 'error', message: `Error fetching organizations: ${error.message}` };
        }
    };

    // ORGANIZATION ROLE MANAGEMENT

    // Function to add role to organization

        /**
     * Add a new organization role with the provided label, description, permissions, and inheritance.
     *
     * @param {string} organizationId - The ID of the organization
     * @param {string} labelName - The label for the new role
     * @param {string} description - The description of the new role
     * @param {Array} permissionsList - The list of permissions for the new role
     * @param {boolean} inheritance - Flag to indicate if the new role inherits permissions
     * @return {Object} An object containing the type of the result and a message or the new role
     */
    const addOrganizationRole = async (organizationId, labelName, description, permissionsList, inheritance) => {

        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Check if organization ID is provided
            if (!organizationId) {
                return { type: 'error', message: 'Organization ID is required.' };
            }

            // Check if labelName and description are provided
            if (!labelName || !description) {
                return { type: 'error', message: 'LabelName and description are required for the new role.' };
            }

            // Check if permissionsList is provided
            if (!permissionsList || !Array.isArray(permissionsList) || permissionsList.length === 0) {
                return { type: 'error', message: 'PermissionsList is required and should be a non-empty array.' };
            }

            // Get the organization document
            const organizationDoc = await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).get();

            // Check if the organization exists
            if (!organizationDoc.exists) {
                return { type: 'error', message: 'Organization not found.' };
            }

            // Get the existing roles
            const existingRoles = organizationDoc.data().roles || {};

            // Check if the labelName is already taken
            if (existingRoles[labelName]) {
                return { type: 'error', message: 'A role with this label already exists in the organization.' };
            }

            // Create the new role object
            const newRole = {
                label: labelName,
                key: labelName.toLowerCase(),
                description,
                weight: Object.keys(existingRoles).length + 1,
                inherits: inheritance,
                permissions: [],
            };

            // Add permissions to the new role
            permissionsList.forEach(permission => {
                newRole.permissions.push(permission); // Use push to add permissions to the array
            });

            // Add the new role to the organization
            existingRoles[labelName] = newRole;

            // Update the organization document with the new roles
            await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).update({
                roles: existingRoles,
            });

            return { type: 'success', message: 'Role added successfully.', newRole };
        } catch (error) {
            return { type: 'error', message: `Error adding role to organization: ${error.message}` };
        }
    };


    // Function to remove a role from an organization

       /**
     * Remove a role from the organization.
     *
     * @param {string} organizationId - The ID of the organization
     * @param {string} roleKey - The key of the role to be removed
     * @return {Promise<object>} An object representing the result of the operation
     */
    const removeRoleFromOrganization = async (organizationId, roleKey) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Check if organization ID and roleKey are provided
            if (!organizationId || !roleKey) {
                return { type: 'error', message: 'Organization ID and roleKey are required.' };
            }

            // Get the organization document
            const organizationDoc = await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).get();

            // Check if the organization exists
            if (!organizationDoc.exists) {
                return { type: 'error', message: 'Organization not found.' };
            }

            // Get the existing roles
            const existingRoles = organizationDoc.data().roles || {};

            // Check if the role exists
            if (!existingRoles[roleKey]) {
                return { type: 'error', message: 'Role not found in the organization.' };
            }

            // Remove the role from the organization
            delete existingRoles[roleKey];

            // Update the organization document without the removed role
            await db.collection(globalConfig.firestoreCollections.organizations)
                .doc(organizationId)
                .update({
                    roles: existingRoles,
                });

            return { type: 'success', message: 'Role removed successfully.', updatedRoles: existingRoles };
        } catch (error) {
            return { type: 'error', message: `Error removing role from organization: ${error.message}` };
        }
    };


    // Function to remove permission(s) from a role

        /**
     * Remove permission from a role in the organization.
     *
     * @param {string} organizationId - The ID of the organization
     * @param {string} roleKey - The key of the role
     * @param {string | Array} permissions - The permission(s) to be removed
     * @return {Promise<Object>} An object with type and message or updatedRoles
     */
    const removePermissionFromRole = async (organizationId, roleKey, permissions) => {
        let permissionsArray = [];

        // check permissions
        permissionManagement.checkPermissions('organization-settings');

        if (typeof permissions === 'string') {
            permissionsArray.push(permissions);
        } else if (Array.isArray(permissions)) {
            permissionsArray = permissions;
        }

        try {


            // Check if organization ID, roleName, and permissions are provided
            if (!organizationId || !roleKey || !permissions) {
                return { type: 'error', message: 'Organization ID, roleName, and permissions are required.' };
            }

            // Get the organization document
            const organizationDoc = await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).get();

            // Check if the organization exists
            if (!organizationDoc.exists) {
                return { type: 'error', message: 'Organization not found.' };
            }

            // Get the existing roles
            const existingRoles = organizationDoc.data().roles || {};

            // Check if the role exists
            if (!existingRoles[roleKey]) {
                return { type: 'error', message: 'Role not found in the organization.' };
            }

            // Get the existing permissions for the specified role
            const existingPermissions = existingRoles[roleKey].permissions || [];

            // Remove specified permissions from the existing ones
            const updatedPermissions = existingPermissions.filter(permission => !permissionsArray.includes(permission));

            // Update the organization document with the modified permissions
            await db.collection(globalConfig.firestoreCollections.organizations)
                .doc(organizationId)
                .update({
                    [`roles.${roleKey}.permissions`]: updatedPermissions,
                });

            return { type: 'success', message: 'Permission(s) removed from role successfully.', updatedRoles: existingRoles };
        } catch (error) {
            return { type: 'error', message: `Error removing permission(s) from role: ${error.message}` };
        }
    };


    // Function to add a new permission to the Permissions List

        /**
     * Add a permission to the organization.
     *
     * @param {string} organizationId - The ID of the organization
     * @param {string} permission - The permission to add
     * @return {Object} An object with type and message properties
     */
    const addPermissionToOrganization = async (organizationId, permission) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('organization-settings');

            // Check if organization ID is provided
            if (!organizationId) {
                return { type: 'error', message: 'Organization ID is required.' };
            }

            // Check if permission is provided
            if (!permission || typeof permission !== 'string' || permission.trim() === '') {
                return { type: 'error', message: 'Permission name is required and should be a non-empty string.' };
            }

            // Get the organization document
            const organizationDoc = await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).get();

            // Check if the organization exists
            if (!organizationDoc.exists) {
                return { type: 'error', message: 'Organization not found.' };
            }

            // Get the existing permissionsList
            const existingPermissionsList = organizationDoc.data().permissionsList || [];

            // Check if the permission already exists
            if (existingPermissionsList.includes(permission)) {
                return { type: 'error', message: 'Permission already exists in the organization.' };
            }

            // Add the new permission to the permissionsList
            const updatedPermissionsList = [...existingPermissionsList, permission];

            // Update the organization document with the updated permissionsList
            await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).update({
                permissionsList: updatedPermissionsList,
            });

            return { type: 'success', message: 'Permission added successfully.', updatedPermissionsList };
        } catch (error) {
            return { type: 'error', message: `Error adding permission to organization: ${error.message}` };
        }
    };

    // Function to add permission(s) to a role

    /**
 * Adds permissions to a role in an organization.
 *
 * @param {string} organizationId - The ID of the organization.
 * @param {object} roleKey - The key of the role.
 * @param {string|string[]} permissions - The permission(s) to add.
 * @return {object} - An object indicating the result of the operation.
 */
    const addPermissionToRole = async (organizationId, roleKey, permissions) => {
        let roleKeyValue = roleKey.roleKey;
        let permissionsArray = [];

        // check permissions
        permissionManagement.checkPermissions('organization-settings');

        if (typeof permissions === 'string') {
            permissionsArray.push(permissions);
        } else if (Array.isArray(permissions)) {
            permissionsArray = permissions;
        }

        try {
            // Check if organization ID, roleName, and permissions are provided
            if (!organizationId || !roleKey || !permissions) {
                return { type: 'error', message: 'Organization ID, roleName, and permissions are required.' };
            }

            // Get the organization document
            const organizationDoc = await db.collection(globalConfig.firestoreCollections.organizations).doc(organizationId).get();

            // Check if the organization exists
            if (!organizationDoc.exists) {
                return { type: 'error', message: 'Organization not found.' };
            }

            // Get the existing roles
            const existingRoles = organizationDoc.data().roles || {};

            // Check if the role exists
            if (!existingRoles[roleKeyValue]) {
                return { type: 'error', message: 'Role not found in the organization.' };
            }

            // Get the existing permissions for the specified role
            const existingPermissions = existingRoles[roleKeyValue].permissions || [];

            // Filter out duplicates before merging
            const uniquePermissionsArray = permissionsArray.filter(permission => !existingPermissions.includes(permission));

            // Merge existing permissions with the new ones
            const updatedPermissions = [...existingPermissions, ...uniquePermissionsArray];

            // Update the organization document with the modified permissions
            await db.collection(globalConfig.firestoreCollections.organizations)
                .doc(organizationId)
                .update({
                    [`roles.${roleKeyValue}.permissions`]: updatedPermissions,
                });

            return { type: 'success', message: 'Permission(s) added to role successfully.', updatedRoles: existingRoles };
        } catch (error) {
            return { type: 'error', message: `Error adding permission(s) to role: ${error.message}` };
        }
    };



    // Return functions for managing organization-related actions
    return {
        createDefaultOrganization,
        createOrganizationBySuperUser,
        editOrganization,
        deleteOrganization,
        addUserToOrganization,
        removeUserFromOrganization,
        fetchUserOrganizations,
        fetchUserInOrganization,
        fetchUserCreatedOrganizations,
        fetchUserAndCreatedOrganizations,
        addOrganizationRole,
        addPermissionToOrganization,
        addPermissionToRole,
        removeRoleFromOrganization,
        removePermissionFromRole
    };
};
