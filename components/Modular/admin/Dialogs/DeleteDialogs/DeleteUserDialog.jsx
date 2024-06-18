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
import { UserLogic } from "@/lib/business_logic/user_logic/user-logic";

// The DeleteUserDialog component handles the deletion of a user.

export function DeleteUserDialog({ userId }) {
    // Access the toast function from context and create an instance of UserLogic.
    const { toast } = useToast();
    const userLogic = UserLogic();

    // State variables for loading indicator and dialog open/close state.
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Handle the deletion of a user.
    const handleDeleteUser = async () => {
        try {
            // Set loading to true during the deletion process.
            setLoading(true);

            // Call the deleteUser method from UserLogic.
            const result = await userLogic.deleteUser(userId);

            // Check the result status and show a toast message accordingly.
            if (result.status === "success") {
                toast({ title: "Success", description: result.message });
                setOpen(false); // Close the dialog upon successful deletion.
            } else {
                toast({ title: "Error", description: result.message });
            }
        } catch (error) {
            // Log and show an error toast message if an exception occurs during deletion.
            console.error("Error deleting user:", error);
            toast({ title: "Error", description: `Error deleting user: ${error.message}` });
        } finally {
            // Set loading back to false regardless of success or failure.
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p>Delete User</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    {/* Confirmation message for user deletion */}
                    <p>Are you sure you want to delete the user?</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {/* Button for initiating the user deletion process */}
                    <Button type="button" onClick={handleDeleteUser} disabled={loading}>
                        {loading ? <Spinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
