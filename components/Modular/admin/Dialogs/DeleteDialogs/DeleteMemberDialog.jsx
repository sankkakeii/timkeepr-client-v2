import React, { useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { MembersLogic } from "@/lib/business_logic/members_logic/members-logic";

// The DeleteMemberDialog component handles the deletion of a team member.

export function DeleteMemberDialog({ selectedItem, activeTeam }) {
    // Access the toast function from context.
    const { toast } = useToast();

    // Create an instance of MembersLogic to handle business logic related to members.
    const membersLogic = MembersLogic();

    // State variables for loading indicator and dialog open/close state.
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Handle the deletion of a team member.
    const handleDeleteMember = async () => {
        try {
            // Set loading to true during the deletion process.
            setLoading(true);

            // Call the deleteMemberInTeam method from MembersLogic.
            const result = await membersLogic.deleteMemberInTeam(
                activeTeam.value.id,
                selectedItem.id
            );

            // Check the result status and show a toast message accordingly.
            if (result.status === "success") {
                toast({ title: "Success", description: result.message });
                setOpen(false); // Close the dialog upon successful deletion.
            } else {
                toast({ title: "Error", description: result.message });
            }
        } catch (error) {
            // Log and show an error toast message if an exception occurs during deletion.
            console.error("Error deleting member:", error);
            toast({ title: "Error", description: `Error deleting member: ${error.message}` });
        } finally {
            // Set loading back to false regardless of success or failure.
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p>Delete Member</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    {/* Confirmation message for member deletion */}
                    <p>Are you sure you want to delete the member: {selectedItem.name}?</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {/* Button for initiating the member deletion process */}
                    <Button type="button" onClick={handleDeleteMember} disabled={loading}>
                        {loading ? <Spinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
