// USER OBJECT STRUCTURE
{
    createdBy: "(string)"
    email: "(string)"
    firstName: "(string)"
    isNewUser: "(boolean)"
    lastName: "(string)"
    name: "(string)"
    profileImage: "(string)"

    role: {
        name: "(string)"
        weight: "(number)"
    }
}

// TEAM OBJECT STRUCTURE
{
    createdBy: "(string)"
    department: "(string)"
    owner: "(string)"
    teamName: "(string)"
    members: [
        {
            id: "(string)",
            name: "(string)",
            role: {
                label: "(string)",
                weight: "(number)",
            }
        }
    ]
    tasks: [
        {
            assignedUserId: "(string)",
            assignedUserName: "(string)",
            taskId: "(string)",
            taskName: "(string)",
        }
    ]
}


// NEW VERSION ORGANIZATION STRUCTURE
const data = {
    createdBy: "(string)",
    department: "(string)",
    name: "(string)",
    owner: "(string)",
    tag: "(string)",
    roles: {
        admin: {
            label: "Administrator",
            key: "admin",
            description: "Full access to all features",
            weight: 1,
            permissions: {
                "user-management": true,
                "team-management": true,
                "task-management": true,
                "organization-settings": true,
                // Additional dynamic permissions can be added here
            },
        },
        superuser: {
            label: "Superuser",
            key: "superuser",
            description: "Extended permissions beyond admin",
            weight: 0,
            inherits: "admin",
            permissions: {
                "additional-superuser-permissions": true,
                // Additional dynamic permissions can be added here
            },
        },
        user: {
            label: "User",
            key: "user",
            description: "Basic user with limited access",
            weight: 2,
            permissions: {
                "self-management": true,
                "task-read": true,
                // Additional dynamic permissions can be added here
            },
        },
        // Custom roles can be added here
        customRole: {
            label: "Custom Role",
            key: "custom-role",
            description: "A role with customizable permissions",
            weight: 75,
            permissions: {
                // Add custom permissions specific to this role
            },
        },
    },
    users: {
        "[userId]": {
            username: "(string)",
            email: "(string)",
            roles: ["user"], // Default role
            // Additional user-related information can be added here
        },
    },
};

