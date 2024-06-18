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
import { OrganizationLogic } from '@/lib/business_logic/organization_logic/organization_logic';
import { XSquare } from "lucide-react";


export function RemoveRolesAndPermissionsDialog({ label, option, roleKey, permission, activeOrganizationId }) {
    // Access the toast function from context and create an instance of UserLogic.
    const { toast } = useToast();


    // State variables for loading indicator and dialog open/close state.
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const organizationLogic = OrganizationLogic();

    const handleRemoveRolesAndPermissions = async () => {
        if (option == 'role') {
            try {
                setLoading(true);
                const result = await organizationLogic.removeRoleFromOrganization(activeOrganizationId, roleKey);

                // Check the result status and show a toast message accordingly.
                if (result.status === "success") {
                    toast({ title: "Success", description: result.message });
                    setOpen(false); // Close the dialog upon successful deletion.
                } else {
                    toast({ title: "Error", description: result.message });
                }
            } catch (error) {
                // Log and show an error toast message if an exception occurs during deletion.
                console.error("Error removing role:", error);
                toast({ title: "Error", description: `Error removing role: ${error.message}` });
            } finally {
                // Set loading back to false regardless of success or failure.
                setLoading(false);
                setOpen(false)
            }


        } else if (option == 'permission') {
            try {
                setLoading(true);
                const result = await organizationLogic.removePermissionFromRole(activeOrganizationId, roleKey, permission);

                // Check the result status and show a toast message accordingly.
                if (result.status === "success") {
                    toast({ title: "Success", description: result.message });
                    setOpen(false); // Close the dialog upon successful deletion.
                } else {
                    toast({ title: "Error", description: result.message });
                }
            } catch (error) {
                // Log and show an error toast message if an exception occurs during deletion.
                console.error("Error removing permission:", error);
                toast({ title: "Error", description: `Error removing permission: ${error.message}` });
            } finally {
                // Set loading back to false regardless of success or failure.
                setLoading(false);
                setOpen(false)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" className="bg-red-600 hover:bg-red-700 text-white items-center">
                    <XSquare size={16} strokeWidth={1.75} />
                    {label}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2 pb-4">
                    {/* Confirmation message for user deletion */}
                    <p>Are you sure you want to {label}?</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {/* Button for initiating the user deletion process */}
                    <Button type="button" onClick={handleRemoveRolesAndPermissions} disabled={loading}>
                        {loading ? <Spinner /> : "Remove"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
