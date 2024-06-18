import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeamLogic } from "@/lib/business_logic/team_logic/team-logic";
import { Spinner } from "@/components/ui/spinner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

/**
 * TeamDialog component handles both the creation and editing of team data.
 * @param {string} type - The type of action, either "create" or "edit".
 * @param {Object} teamData - Existing team data when editing.
 * @param {Object} authUser - Current authenticated user.
 */
export function TeamDialog({ type, teamData, authUser }) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const teamLogic = TeamLogic();

    // Define a Zod schema for team data validation
    const teamSchema = z.object({
        teamName: z.string().min(3).max(40),
        owner: z.string().min(3).max(40),
        department: z.string().min(3).max(40),
    });

    // Set up react-hook-form with Zod resolver
    const form = useForm({
        resolver: zodResolver(teamSchema),
        defaultValues: {
            teamName: teamData?.teamName || "",
            owner: teamData?.owner || "",
            department: teamData?.department || "",
        },
    });

    // Reset the form values when teamData changes
    useEffect(() => {
        form.reset({
            teamName: teamData?.teamName || "",
            owner: teamData?.owner || "",
            department: teamData?.department || "",
        });
    }, [form, teamData]);

    // Function to handle team creation or editing
    const handleTeamAction = async () => {
        try {
            setLoading(true);

            const formData = form.getValues();

            // Choose the appropriate action based on the type prop
            if (type === "create") {
                const result = await teamLogic.createTeam(authUser, formData.teamName, formData.owner, formData.department);
                handleResult(result);
            } else if (type === "edit") {
                const result = await teamLogic.editTeam(teamData.id, formData);
                handleResult(result);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle the result of team creation or editing
    const handleResult = (result) => {
        if (result.type === "success") {
            toast({ title: "Success", description: result.message });
            form.reset();
            setOpen(false); // Close the dialog on success
        } else {
            toast({ title: "Error", description: result.message });
        }
    };

    // Function to handle errors during team creation or editing
    const handleError = (error) => {
        if (error instanceof z.ZodError) {
            console.error("Validation error:", error);
            toast({ title: "Error", description: "Invalid form data: Fill in all Fields" });
        } else {
            console.error("Error:", error);
            toast({ title: "Error", description: `Error: ${error.message}` });
        }
    };

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p variant="outline">{type === "create" ? "Create Team" : "Edit Team"}</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === "create" ? "Create Team" : "Edit Team"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleTeamAction)} className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="teamName">Team name</Label>
                        <Input id="teamName" placeholder="Team Name" {...form.register("teamName")} />
                        {form.formState.errors.teamName && <span className="text-xs text-red-500">{form.formState.errors.teamName.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="owner">Owner</Label>
                        <Input id="owner" placeholder="Owner Name" {...form.register("owner")} />
                        {form.formState.errors.owner && <span className="text-xs text-red-500">{form.formState.errors.owner.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" placeholder="Department Name" {...form.register("department")} />
                        {form.formState.errors.department && <span className="text-xs text-red-500">{form.formState.errors.department.message}</span>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Spinner /> : "Continue"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
