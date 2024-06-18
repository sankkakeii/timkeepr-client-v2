// Import necessary modules and functions
import { useAuth } from '@/context/AuthUserContext';
import globalConfig from '@/globalConfig';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { RoleAndPermissionManagement } from '@/lib/role_management/role-management';

// Create a logic module for managing tasks within a team
export const TaskLogic = () => {
    // Access the authenticated user from the authentication context
    const { authUser } = useAuth();
    const permissionManagement = RoleAndPermissionManagement();
    permissionManagement.compareAndLogRoles()


    // Function to generate a unique task ID using the uuid library

    /**
 * Generates a task ID using the uuidv4 library.
 *
 * @return {string} the generated task ID
 */
    const generateTaskId = () => {
        return uuidv4();
    };

    // Function to add a task to a team

    /**
 * Adds a task to the specified team, with the provided task name, assigned user name, and assigned user ID.
 *
 * @param {string} teamId - The ID of the team to which the task will be added
 * @param {string} taskName - The name of the task to be added
 * @param {string} assignedUserName - The name of the user to whom the task is assigned
 * @param {string} assignedUserId - The ID of the user to whom the task is assigned
 * @return {Object} An object containing the status and message of the operation
 */
    const addTaskToTeam = async (teamId, taskName, assignedUserName, assignedUserId) => {
        try {
            // Check if the user is authenticated
            if (!authUser) {
                throw new Error('User not authenticated');
            }
            // check permissions
            permissionManagement.checkPermissions('task-management');


            // Access the team document reference
            const teamRef = db.collection(globalConfig.firestoreCollections.teams).doc(teamId);
            const teamSnapshot = await teamRef.get();

            // Check if the team exists
            if (!teamSnapshot.exists) {
                throw new Error('Team not found');
            }

            // Generate a unique task ID
            const taskId = generateTaskId();

            // Update the 'tasks' field in the team document
            const updatedTasks = [...teamSnapshot.data().tasks, { taskId, taskName, assignedUserName, assignedUserId }];
            await teamRef.update({ tasks: updatedTasks });

            return { status: 'success', message: 'Task added successfully.' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Function to edit a task in a team

    /**
 * Edit a task in a team by updating the task details.
 *
 * @param {string} teamId - The ID of the team where the task belongs.
 * @param {string} taskId - The ID of the task to be updated.
 * @param {object} updatedTask - The updated task details.
 * @return {object} An object containing the status and message of the update operation.
 */
    const editTaskInTeam = async (teamId, taskId, updatedTask) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('task-management');

            // Check if the user is authenticated
            if (!authUser) {
                throw new Error('User not authenticated');
            }

            // Use a Firestore transaction to ensure consistency
            await db.runTransaction(async (transaction) => {
                const teamRef = db.collection(globalConfig.firestoreCollections.teams).doc(teamId);
                const teamSnapshot = await transaction.get(teamRef);

                // Check if the team exists
                if (!teamSnapshot.exists) {
                    throw new Error('Team not found');
                }

                const teamData = teamSnapshot.data();

                // Update the 'tasks' field by mapping over existing tasks
                const updatedTasks = teamData.tasks.map((task) =>
                    task.taskId === taskId ? { ...task, ...updatedTask } : task
                );

                // Update the team document with the modified 'tasks' field
                transaction.update(teamRef, { tasks: updatedTasks });
            });

            return { status: 'success', message: 'Task updated successfully.' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Function to fetch tasks of a team by teamId

    /**
 * Fetches tasks by team id.
 *
 * @param {string} teamId - The id of the team
 * @return {object} An object with status and tasks
 */
    const fetchTasksByTeamId = async (teamId) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('task-management');

            // Access the team document reference
            const teamRef = db.collection(globalConfig.firestoreCollections.teams).doc(teamId);
            const teamSnapshot = await teamRef.get();

            // Check if the team exists
            if (!teamSnapshot.exists) {
                throw new Error('Team not found');
            }

            const teamData = teamSnapshot.data();

            // Access the 'tasks' field in the team document, default to an empty array if not present
            const tasks = teamData.tasks || [];

            return { status: 'success', tasks };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Function to delete a task from a team

    /**
 * Asynchronously deletes a task in a team.
 *
 * @param {string} teamId - The ID of the team from which the task will be deleted
 * @param {string} taskId - The ID of the task to be deleted
 * @return {Promise<Object>} An object containing the status and message of the deletion operation
 */
    const deleteTaskInTeam = async (teamId, taskId) => {
        try {
            // check permissions
            permissionManagement.checkPermissions('task-management');

            // Check if the user is authenticated
            if (!authUser) {
                throw new Error('User not authenticated');
            }

            // Use a Firestore transaction to ensure consistency
            await db.runTransaction(async (transaction) => {
                const teamRef = db.collection(globalConfig.firestoreCollections.teams).doc(teamId);
                const teamSnapshot = await transaction.get(teamRef);

                // Check if the team exists
                if (!teamSnapshot.exists) {
                    throw new Error('Team not found');
                }

                const teamData = teamSnapshot.data();

                // Remove the task with the specified id from the 'tasks' array
                const updatedTasks = teamData.tasks.filter((task) =>
                    task.taskId !== taskId
                );

                // Update the team document with the modified 'tasks' field
                transaction.update(teamRef, { tasks: updatedTasks });
            });

            return { status: 'success', message: 'Task deleted successfully.' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    };

    // Return functions for managing tasks within a team
    return {
        addTaskToTeam,
        editTaskInTeam,
        fetchTasksByTeamId,
        deleteTaskInTeam
    };
};

