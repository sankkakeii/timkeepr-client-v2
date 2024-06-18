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
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserLogic } from "@/lib/business_logic/user_logic/user-logic";
import { Spinner } from "@/components/ui/spinner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // Import Zod resolver for react-hook-form
import { useForm } from "react-hook-form";
import { useOrganization } from "@/context/OrganizationContext";
import { RoleAndPermissionManagement } from "@/lib/role_management/role-management";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

export function UserDialog({ type, selectedUser }) {
    const [loading, setLoading] = useState(false);
    const userLogic = UserLogic();
    const { toast } = useToast();
    const { activeOrganization } = useOrganization();
    const getStructuredRoleInstance = RoleAndPermissionManagement();

    const userSchema = z.object({
        firstname: z.string().min(2).max(20),
        lastname: z.string().min(2).max(20),
        email: z.string().email(),
    });

    const form = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstname: selectedUser?.firstname || "",
            lastname: selectedUser?.lastname || "",
            email: selectedUser?.email || "",
        },
    });

    useEffect(() => {
        if (type === "edit" && selectedUser) {
            form.reset({
                firstname: selectedUser?.firstname || "",
                lastname: selectedUser?.lastname || "",
                email: selectedUser?.email || "",
                role: selectedUser?.role || "",
            });
        }
    }, [type, selectedUser, form]);


    const handleUserAction = async () => {
        try {
            setLoading(true);

            const userData = form.getValues();

            if (type === "create") {
                const name = userData.firstname + ' ' + userData.lastname;
                // Use getStructuredRole to get the structured role object
                const structuredRole = getStructuredRoleInstance.getStructuredRole(userData.role);
                const result = await userLogic.addUser(userData.firstname, userData.lastname, name, userData.email, structuredRole);
                handleResult(result);
            } else if (type === "edit" && selectedUser) {
                // Use getStructuredRole to get the structured role object
                const structuredRole = getStructuredRoleInstance.getStructuredRole(userData.role);
                const result = await userLogic.editUser(selectedUser.id, userData.firstname, userData.lastname, userData.email, structuredRole);
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
            form.reset();
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
            console.error("Error creating/editing user:", error);
            toast({ title: "Error", description: `Error: ${error.message}` });
        }
    };

    const [open, setOpen] = useState(false);

    // Watch the value of the role field
    const roleValue = form.watch("role");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p>{type === "create" ? "Create New User" : "Edit User"}</p>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === "create" ? "Create User" : "Edit User"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleUserAction)} className="space-y-4 py-2 pb-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstname">First name</Label>
                        <Input id="firstname" placeholder="Enter first name" {...form.register("firstname")} />
                        {form.formState.errors.firstname && <span className="text-xs text-red-500">{form.formState.errors.firstname.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastname">Last name</Label>
                        <Input id="lastname" placeholder="Enter last name" {...form.register("lastname")} />
                        {form.formState.errors.lastname && <span className="text-xs text-red-500">{form.formState.errors.lastname.message}</span>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" placeholder="Enter email" {...form.register("email")} />
                        {form.formState.errors.email && <span className="text-xs text-red-500">{form.formState.errors.email.message}</span>}
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <Label htmlFor="role" className="text-left">Role</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-left" value={roleValue || "Select Role"}>
                                    {roleValue || "Select Role"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuGroup>
                                    {Object.entries(activeOrganization.roles)
                                        .filter(([role]) => role !== 'superuser') // Exclude 'superuser' role
                                        .map(([role, weight]) => (
                                            <DropdownMenuItem key={role} onSelect={() => form.setValue("role", role)} value={role}>
                                                {role}
                                            </DropdownMenuItem>
                                        ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Spinner /> : `Continue`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
