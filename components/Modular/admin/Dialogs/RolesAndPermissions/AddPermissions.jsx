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
import { Spinner } from "@/components/ui/spinner";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrganization } from "@/context/OrganizationContext";
import { OrganizationLogic } from "@/lib/business_logic/organization_logic/organization_logic";


export function AddPermissionsDialog(roleKey) {
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchPermissions, setSearchPermissions] = useState("");
    const { activeOrganization } = useOrganization();
    const organizationLogic = OrganizationLogic();

    const { toast } = useToast();

    const SelectedPermissionsList = ({ selectedPermissions, onRemovePermission }) => {
        return (
            <div className="flex flex-wrap space-x-2">
                {selectedPermissions.map((permission) => (
                    <div key={permission} className="bg-primary text-white px-2 py-1 rounded flex items-center">
                        {permission}
                        <button
                            type="button"
                            className="ml-2 focus:outline-none"
                            onClick={() => onRemovePermission(permission)}
                        >
                            &#x2715; {/* Remove icon */}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const handleAddPermissionToRole = async () => {
        try {
            setLoading(true);

            const result = await organizationLogic.addPermissionToRole(
                activeOrganization.id,
                roleKey,
                selectedPermissions
            );

            if (result.type === "success") {
                toast({ title: "success", description: result.message });
                setSelectedPermissions([]); // Clear selected permissions after successful addition
                setOpen(false)
            } else {
                toast({ title: "error", description: result.message });
            }
        } catch (error) {
            console.error("Error adding permissions to role:", error);
            toast({
                title: "error",
                description: `Error adding permissions to role: ${error.message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Permission</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Permissions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-4 flex flex-col">
                        <Label htmlFor="existingUser">Search</Label>
                        <Input
                            id="searchPermissions"
                            placeholder="Search for Permissions"
                            value={searchPermissions}
                            onChange={(e) => setSearchPermissions(e.target.value)}
                        />

                        <Label htmlFor="existingUser">Selected Permission(s)</Label>
                        <SelectedPermissionsList
                            selectedPermissions={selectedPermissions}
                            onRemovePermission={(permission) =>
                                setSelectedPermissions((prevPermissions) =>
                                    prevPermissions.filter((selected) => selected !== permission)
                                )
                            }
                        />

                        <Label htmlFor="existingUser">Select Permission(s)</Label>
                        <div className="space-y-2 flex flex-col">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="text-left">
                                        {activeOrganization ? "Select Permissions" : "Loading Permissions"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="start">
                                    <DropdownMenuGroup>
                                        {activeOrganization && activeOrganization.permissionsList ? (
                                            <DropdownMenuGroup>
                                                {activeOrganization.permissionsList.map((permission) => (
                                                    <DropdownMenuItem
                                                        key={permission}
                                                        onSelect={() =>
                                                            setSelectedPermissions((prevPermissions) =>
                                                                prevPermissions.includes(permission)
                                                                    ? prevPermissions.filter(
                                                                        (selected) => selected !== permission
                                                                    )
                                                                    : [...prevPermissions, permission]
                                                            )
                                                        }
                                                        value={`${permission}`}
                                                        // isSelected={selectedPermissions.includes(permission)}
                                                    >
                                                        {`${permission}`}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuGroup>
                                        ) : (
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        )}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleAddPermissionToRole} disabled={loading}>
                        {loading ? <Spinner /> : "Continue"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
