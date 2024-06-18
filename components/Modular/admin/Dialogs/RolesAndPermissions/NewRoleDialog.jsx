import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrganization } from '@/context/OrganizationContext';
import { OrganizationLogic } from '@/lib/business_logic/organization_logic/organization_logic';

export function NewRoleDialog() {
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [selectedInheritances, setSelectedInheritances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [labelName, setLabelName] = useState('');
    const [description, setDescription] = useState('');
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

    const SelectedInheritancesList = ({ selectedInheritances, onRemoveInheritance }) => {
        return (
            <div className="flex flex-wrap space-x-2">
                {selectedInheritances.map((inheritance) => (
                    <div key={inheritance} className="bg-primary text-white px-2 py-1 rounded flex items-center">
                        {inheritance}
                        <button
                            type="button"
                            className="ml-2 focus:outline-none"
                            onClick={() => onRemoveInheritance(inheritance)}
                        >
                            &#x2715; {/* Remove icon */}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const handleAddRole = async () => {
        try {
            setLoading(true);

            const result = await organizationLogic.addOrganizationRole(
                activeOrganization.id,
                labelName,
                description,
                selectedPermissions,
                selectedInheritances
            );

            if (result.type === 'success') {
                toast({ title: 'success', description: result.message });
                setSelectedPermissions([]);
                setSelectedInheritances([]);
                setOpen(false);
            } else {
                toast({ title: 'error', description: result.message });
            }
        } catch (error) {
            console.error('Error adding role:', error);
            toast({
                title: 'error',
                description: `Error adding role: ${error.message}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const [open, setOpen] = useState(false);

    const handleRemovePermission = (permission) => {
        setSelectedPermissions(selectedPermissions.filter((selected) => selected !== permission));
    };

    const handleRemoveInheritance = (inheritance) => {
        setSelectedInheritances(selectedInheritances.filter((selected) => selected !== inheritance));
    };

    const handlePermissionSelect = (permission) => {
        if (selectedPermissions.includes(permission)) {
            setSelectedPermissions(selectedPermissions.filter((selected) => selected !== permission));
        } else {
            setSelectedPermissions([...selectedPermissions, permission]);
        }
    };

    const handleInheritanceSelect = (inheritance) => {
        if (selectedInheritances.includes(inheritance)) {
            setSelectedInheritances(selectedInheritances.filter((selected) => selected !== inheritance));
        } else {
            setSelectedInheritances([...selectedInheritances, inheritance]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add New Role</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    <div className="space-y-4 flex flex-col">
                        <Label htmlFor="labelName">Label</Label>
                        <Input
                            id="labelName"
                            placeholder="Enter Label Name"
                            value={labelName}
                            onChange={(e) => setLabelName(e.target.value)}
                        />

                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Enter Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <Label htmlFor="selectedPermissions">Selected Permission(s)</Label>
                        <SelectedPermissionsList
                            selectedPermissions={selectedPermissions}
                            onRemovePermission={handleRemovePermission}
                        />

                        <Label htmlFor="selectedInheritances">Selected Inheritance(s)</Label>
                        <SelectedInheritancesList
                            selectedInheritances={selectedInheritances}
                            onRemoveInheritance={handleRemoveInheritance}
                        />

                        <Label htmlFor="selectPermissions">Select Permission(s)</Label>
                        <div className="space-y-2 flex flex-col">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="text-left">
                                        {activeOrganization && selectedPermissions.length > 0
                                            ? 'Selected Permissions'
                                            : 'Select Permissions'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="start">
                                    <DropdownMenuGroup>
                                        {activeOrganization && activeOrganization.permissionsList && (
                                            <DropdownMenuGroup>
                                                {activeOrganization.permissionsList.map((permission) => (
                                                    <DropdownMenuItem
                                                        key={permission}
                                                        onSelect={() => handlePermissionSelect(permission)}
                                                        value={`${permission}`}
                                                    >
                                                        {`${permission}`}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuGroup>
                                        )}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <Label htmlFor="selectInheritances">Select Inheritance(s)</Label>
                        <div className="space-y-2 flex flex-col">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="text-left">
                                        {activeOrganization && Object.values(activeOrganization.roles).length > 0
                                            ? 'Selected Inheritances'
                                            : 'Select Inheritances'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="start">
                                    <DropdownMenuGroup>
                                        {activeOrganization &&
                                            Object.values(activeOrganization.roles).map((role) => (
                                                <DropdownMenuItem
                                                    key={role.key}
                                                    onSelect={() => handleInheritanceSelect(role.key)}
                                                    value={`${role.key}`}
                                                >
                                                    {`${role.key}`}
                                                </DropdownMenuItem>
                                            ))}
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
                    <Button type="submit" onClick={handleAddRole} disabled={loading}>
                        {loading ? <Spinner /> : 'Continue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
