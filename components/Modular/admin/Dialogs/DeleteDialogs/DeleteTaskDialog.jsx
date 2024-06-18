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
import { TaskLogic } from "@/lib/business_logic/task_logic/task-logic";

// The DeleteTaskDialog component handles the deletion of a task within a team.

export function DeleteTaskDialog({ selectedItem, activeTeam }) {
    // Access toast function from context.
    const { toast } = useToast();

    // Create an instance of TaskLogic to handle business logic related to tasks.
    const taskLogic = TaskLogic();

    // State variables for loading indicator and dialog open/close state.
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // Handle the deletion of a task.
    const handleDeleteTask = async () => {
        try {
            // Set loading to true during the deletion process.
            setLoading(true);

            // Call the deleteTaskInTeam method from TaskLogic.
            const result = await taskLogic.deleteTaskInTeam(
                activeTeam.value.id,
                selectedItem.taskId
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
            console.error("Error deleting task:", error);
            toast({ title: "Error", description: `Error deleting task: ${error.message}` });
        } finally {
            // Set loading back to false regardless of success or failure.
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p>Delete Task</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    {/* Confirmation message for task deletion */}
                    <p>Are you sure you want to delete the task: {selectedItem.taskName}?</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {/* Button for initiating the task deletion process */}
                    <Button type="button" onClick={handleDeleteTask} disabled={loading}>
                        {loading ? <Spinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
