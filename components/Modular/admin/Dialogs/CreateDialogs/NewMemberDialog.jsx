import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthUserContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserLogic } from "@/lib/business_logic/user_logic/user-logic";
import { MembersLogic } from "@/lib/business_logic/members_logic/members-logic";
import { useTeam } from "@/context/TeamContext";

const TeamMembersDropdown = ({ users, selectedUser, setSelectedUser }) => (
    <div className="space-y-2 flex flex-col">
        <Label htmlFor="existingUser">Select Existing User</Label>
        <div className="space-y-2 flex flex-col">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="text-left">
                        {selectedUser ? `${selectedUser.name}` : "Select User"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                        {users.map((user) => (
                            <DropdownMenuItem
                                key={user.id}
                                onSelect={() => setSelectedUser(user)}
                                value={`${user.name}`}
                            >
                                {`${user.name}`}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
);

export function NewMemberDialog() {
    const [selectedSection, setSelectedSection] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const { activeTeam } = useTeam();
    const { authUser } = useAuth();
    const { toast } = useToast();
    const membersLogic = MembersLogic();
    const usersLogic = UserLogic();

    const handleAddMember = async () => {
        try {
            setLoading(true);

            switch (selectedSection) {
                case "addExisting":
                    if (selectedUser) {
                        const result = await membersLogic.addExistingUserToTeam(
                            activeTeam.value.id,
                            selectedUser
                        );
                        if (result.status === "success") {
                            toast({ title: "success", description: result.message });
                            setSelectedSection(null);
                            setOpen(false);
                        } else {
                            toast({ title: "error", description: result.message });
                        }
                    }
                    break;

                case "inviteByEmail":
                    const emailResult = await membersLogic.inviteUserByEmail(
                        email, activeTeam.value.id, authUser.uid
                    );
                    if (emailResult.status === "success") {
                        toast({ title: "success", description: emailResult.message });
                        setSelectedSection(null);
                    } else {
                        toast({ title: "error", description: emailResult.message });
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Error adding member:", error);
            toast({
                title: "error",
                description: `Error adding member: ${error.message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!authUser) {
                    toast({
                        title: "error",
                        description: "No users fetched. Check your internet",
                    });
                    return;
                }

                const getUsersResult = await usersLogic.getUsers(authUser);

                if (getUsersResult.status === "success") {
                    setUsers(getUsersResult.data || []);
                } else {
                    toast({
                        title: "error",
                        description: getUsersResult.message,
                    });
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast({
                    title: "error",
                    description: `Error fetching users: ${error.message}`,
                });
            }
        };

        fetchUsers();
    }, [authUser, toast]);

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add New Member</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    {selectedSection === null && (
                        <div className="space-y-2 flex flex-col">
                            <Button onClick={() => setSelectedSection("inviteByEmail")}>
                                Send Invite By Email
                            </Button>
                            <Button onClick={() => setSelectedSection("addExisting")}>
                                Add Existing User
                            </Button>
                        </div>
                    )}
                    {selectedSection === "inviteByEmail" && (
                        <div className="space-y-2 flex flex-col">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="space-y-2">
                                <Button onClick={() => setSelectedSection(null)}>Go Back</Button>
                            </div>
                        </div>
                    )}
                    {selectedSection === "addExisting" && (
                        <div className="space-y-2 flex flex-col">
                            <TeamMembersDropdown
                                users={users}
                                selectedUser={selectedUser}
                                setSelectedUser={setSelectedUser}
                            />
                            <div className="space-y-2">
                                <Button onClick={() => setSelectedSection(null)}>Go Back</Button>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {selectedSection !== null && (
                        <Button type="submit" onClick={handleAddMember} disabled={loading}>
                            {loading ? <Spinner /> : "Continue"}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
