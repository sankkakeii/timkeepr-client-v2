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
import * as z from "zod";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskLogic } from "@/lib/business_logic/task_logic/task-logic";
import { MembersLogic } from "@/lib/business_logic/members_logic/members-logic";

const TeamMembersDropdown = ({ assignee, setAssignee, teamMembers }) => (
    <div className="space-y-2 flex flex-col">
        <Label htmlFor="assignee" className="text-left">Assignee</Label>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-left">
                    {assignee ? assignee.name : "Select Assignee"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                    {teamMembers.map((member, index) => (
                        <DropdownMenuItem
                            key={index}
                            onSelect={() => setAssignee(member)}
                        >
                            {member.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);

export function TaskDialog({ type, selectedItem, activeTeam }) {
    const [taskName, setTaskName] = useState("");
    const [assignee, setAssignee] = useState("");
    const [loading, setLoading] = useState(false);
    const { authUser } = useAuth();
    const { toast } = useToast();
    const taskLogic = TaskLogic();
    const membersLogic = MembersLogic();

    const [teamMembers, setTeamMembers] = useState([]);

    const taskSchema = z.object({
        taskName: z.string().min(3).max(100),
        assignee: z.object({
            name: z.string().min(3).max(100),
            id: z.string().min(3).max(100),
        }),
    });

    const fetchMembers = async () => {
        try {
            if (!authUser) {
                setLoading(false);
                toast({
                    title: "error",
                    description: "No tasks fetched. Check your internet",
                });
                return;
            }

            setLoading(true);

            const membersResult = await membersLogic.fetchMembersByTeamId(activeTeam.value.id);
            if (membersResult.status === "success") {
                setTeamMembers(membersResult.members);
            } else {
                toast({
                    title: "errors",
                    description: membersResult.message,
                });
            }

            setOpen(false)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching members:", error);
            toast({
                title: "error",
                description: `Error fetching members: ${error.message}`,
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
        if (type === "edit" && selectedItem) {
            setTaskName(selectedItem.taskName);
            setAssignee(selectedItem.assignee);
        }
    }, [authUser, activeTeam, toast, type, selectedItem]);

    const handleTaskAction = async () => {
        try {
            setLoading(true);
            const taskData = taskSchema.parse({ taskName, assignee });

            if (type === "create") {
                const result = await taskLogic.addTaskToTeam(
                    activeTeam.value.id,
                    taskData.taskName,
                    taskData.assignee.name,
                    taskData.assignee.id
                );
                handleResult(result);
            } else if (type === "edit" && selectedItem) {
                const result = await taskLogic.editTaskInTeam(
                    activeTeam.value.id,
                    selectedItem.taskId,
                    {
                        taskName: taskData.taskName,
                        assignedUserName: taskData.assignee ? taskData.assignee.name : "", // Check if assignee is defined
                        assignedUserId: taskData.assignee ? taskData.assignee.id : ""
                    }
                );
                handleResult(result);
            }
        } catch (error) {
            handleError(error);

        } finally {
            setLoading(false);
        }
    };

    const handleResult = (result) => {
        if (result.status === "success") {
            toast({ title: "Success", description: result.message });
            setOpen(false);
        } else {
            toast({ title: "Error", description: result.message });
        }
    };

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
                <p>{type === "create" ? "Add New Task" : "Edit Task"}</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === "create" ? "Add New Task" : "Edit Task"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="name">Task Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter task name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </div>

                    {activeTeam.value ? (
                        activeTeam.value.members && activeTeam.value.members.length > 0 ? (
                            <TeamMembersDropdown
                                assignee={assignee}
                                setAssignee={setAssignee}
                                teamMembers={teamMembers}
                            />
                        ) : (
                            <p className="text-red-500">No team members available to assign.</p>
                        )
                    ) : (
                        <p className="text-red-500">Unable to fetch team members. Please try again.</p>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleTaskAction} disabled={loading}>
                        {loading ? <Spinner /> : "Continue"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
