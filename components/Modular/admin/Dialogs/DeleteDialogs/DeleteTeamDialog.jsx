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
import { TeamLogic } from "@/lib/business_logic/team_logic/team-logic";
import { useTeam } from '@/context/TeamContext';

// The DeleteTeamDialog component handles the deletion of a team.

export function DeleteTeamDialog({ teamId }) {
    // Access the toast function from context and create an instance of TeamLogic.
    const { toast } = useToast();
    const teamLogic = TeamLogic();
    const { activeTeam } = useTeam();

    // State variables for loading indicator and dialog open/close state.
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Handle the deletion of a team.
    const handleDeleteTeam = async () => {
        try {
            // Set loading to true during the deletion process.
            setLoading(true);

            // Call the deleteTeam method from TeamLogic.
            const result = await teamLogic.deleteTeam(teamId, activeTeam);

            // Check the result type and show a toast message accordingly.
            if (result.type === "success") {
                toast({ title: "Success", description: result.message });
                setOpen(false); // Close the dialog upon successful deletion.
            } else {
                toast({ title: "Error", description: result.message });
            }
        } catch (error) {
            // Log and show an error toast message if an exception occurs during deletion.
            console.error("Error deleting team:", error);
            toast({ title: "Error", description: `Error deleting team: ${error.message}` });
        } finally {
            // Set loading back to false regardless of success or failure.
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p>Delete Team</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Team</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    {/* Confirmation message for team deletion */}
                    <p>Are you sure you want to delete the team?</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {/* Button for initiating the team deletion process */}
                    <Button type="button" onClick={handleDeleteTeam} disabled={loading}>
                        {loading ? <Spinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
