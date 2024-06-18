// Import necessary modules and functions
import { useAuth } from '@/context/AuthUserContext';
import { useOrganization } from '@/context/OrganizationContext';

// Create a logic module for managing tasks within a team
export const RoleAndPermissionManagement = () => {
    const { authUser } = useAuth();
    // Function to compare roles and log relevant data
    const { activeOrganization } = useOrganization();

    const compareAndLogRoles = () => {
        try {
            if (authUser && activeOrganization) {
                const authUserRoleKey = authUser.data.role.key;

                const matchingRoleKey = Object.keys(activeOrganization.roles).find(roleKey => authUserRoleKey === roleKey);

                if (matchingRoleKey) {
                    const matchingRole = activeOrganization.roles[matchingRoleKey];

                    // Check for role inheritance
                    if (matchingRole.inherits) {
                        const inheritedRolesKeys = Array.isArray(matchingRole.inherits)
                            ? matchingRole.inherits
                            : [matchingRole.inherits];

                        // Initialize an array to store aggregated permissions
                        let aggregatedPermissions = [];

                        inheritedRolesKeys.forEach((inheritedRoleKey) => {
                            const inheritedRole = activeOrganization.roles[inheritedRoleKey];

                            if (inheritedRole) {
                                // Combine permissions from current role and each inherited role
                                aggregatedPermissions = [
                                    ...aggregatedPermissions,
                                    ...matchingRole.permissions,
                                    ...inheritedRole.permissions,
                                ];
                            } else {
                                throw new Error(`Inherited role ${inheritedRoleKey} not found.`);
                            }
                        });

                        // Set the aggregatedPermissions array to the matchingRole
                        matchingRole.aggregatedPermissions = aggregatedPermissions;
                    } else {
                        // If no inheritance, use the default role permissions
                        matchingRole.aggregatedPermissions = matchingRole.permissions;
                    }
                } else {
                    throw new Error('Roles do not match.');
                }
            } else {
                throw new Error('Authentication or Organization data missing.');
            }

            return { status: 'success', message: 'Roles compared and logged successfully.' };
        } catch (error) {
            return { status: 'error', message: `Error comparing and logging roles: ${error.message}` };
        }
    };

    // Define a function to get the structured role object
    const getStructuredRole = (selectedRole) => {
        try {
            const roles = activeOrganization.roles;
            const structuredRole = roles[selectedRole];

            if (!structuredRole) {
                throw new Error(`Role ${selectedRole} not found.`);
            }

            return { status: 'success', data: structuredRole };
        } catch (error) {
            return { status: 'error', message: `Error getting structured role: ${error.message}` };
        }
    };

    // Check the permissions a user role has available
    const checkPermissions = (userPermissions) => {
        try {
            // Use the aggregated/inherited role permissions or default authUser permissions
            const organizationPermissions = activeOrganization.roles[authUser.data.role.key]?.aggregatedPermissions || authUser.data.role.permissions;

            if (typeof userPermissions === 'string') {
                // If a single permission string is passed
                if (!organizationPermissions.includes(userPermissions)) {
                    throw new Error('USER DOES NOT HAVE APPROPRIATE PERMISSIONS');
                }
            } else if (Array.isArray(userPermissions)) {
                // If an array of permissions is passed
                const hasAtLeastOnePermission = userPermissions.some(permission => organizationPermissions.includes(permission));

                if (!hasAtLeastOnePermission) {
                    throw new Error('USER DOES NOT HAVE ANY APPROPRIATE PERMISSIONS');
                }
            } else {
                throw new Error('INVALID PERMISSIONS FORMAT');
            }

            return { status: 'success', message: 'User has appropriate permissions.' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Return functions for managing roles and permissions
    return {
        compareAndLogRoles,
        getStructuredRole,
        checkPermissions
    };
};
