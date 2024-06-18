import React, { useEffect, useState } from "react";
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
import * as z from "zod";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MembersLogic } from "@/lib/business_logic/members_logic/members-logic";

// The EditMemberDialog component allows editing the details of a team member.
export function EditMemberDialog({ selectedItem, activeTeam }) {
    // State variables for member details and loading indicator.
    const [memberName, setMemberName] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);

    // Populate member details when the component mounts.
    useEffect(() => {
        setMemberName(selectedItem.name);
        setRole(selectedItem.role);
    }, []);

    const { toast } = useToast();

    // Define a schema for member data validation using zod.
    const memberSchema = z.object({
        name: z.string().min(3).max(100),
        role: z.string().min(3).max(100),
    });

    // Create an instance of MembersLogic to handle business logic related to members.
    const memberLogic = MembersLogic();

    // Handle the editing of a team member.
    const handleEditMember = async () => {
        try {
            // Set loading to true during the editing process.
            setLoading(true);

            // Parse and validate member data using the defined schema.
            const memberData = memberSchema.parse({ name: memberName, role });

            // Call the editMemberInTeam method from MembersLogic.
            const result = await memberLogic.editMemberInTeam(
                activeTeam.value.id,
                selectedItem.id,
                {
                    name: memberData.name,
                    role: memberData.role,
                }
            );

            // Check the result status and show a toast message accordingly.
            if (result.status === "success") {
                toast({ title: "Success", description: result.message });
                setOpen(false); // Close the dialog upon successful editing.
            } else {
                toast({ title: "Error", description: result.message });
            }
        } catch (error) {
            // Handle validation error separately and log other errors.
            if (error instanceof z.ZodError) {
                console.error("Validation error:", error);
                toast({ title: "Error", description: "Invalid form data: Fill in all Fields" });
            } else {
                console.error("Error editing member:", error);
                toast({ title: "Error", description: `Error editing member: ${error.message}` });
            }
        } finally {
            // Set loading back to false regardless of success or failure.
            setLoading(false);
        }
    };

    // State variable for dialog open/close state.
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p>Edit Member</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    {/* Input for member name */}
                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="name">Member Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter member name"
                            value={memberName}
                            onChange={(e) => setMemberName(e.target.value)}
                        />
                    </div>

                    {/* Dropdown for selecting member role */}
                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="role" className="text-left">Role</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-left">
                                    {role ? role : "Select Role"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem key={'user'} onSelect={() => setRole('user')} value="user">User</DropdownMenuItem>
                                    <DropdownMenuItem key={'admin'} onSelect={() => setRole('admin')} value="admin">Admin</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {/* Button for initiating the member editing process */}
                    <Button type="submit" onClick={handleEditMember} disabled={loading}>
                        {loading ? <Spinner /> : "Continue"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
