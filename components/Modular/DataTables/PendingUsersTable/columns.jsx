import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DialogDropdownMenuItem,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteUserDialog } from "../../admin/Dialogs/DeleteDialogs/DeleteUserDialog";
import { UserDialog } from "../../admin/Dialogs/UserDialog";
import { Checkbox } from "@/components/ui/checkbox";
const selectionColumn = {
    id: "select",
    header: ({ table }) => (
        <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
    ),
    enableSorting: false,
    enableHiding: false,
};

const actionsColumn = {
    id: "actions",
    cell: ({ row }) => {
        const user = row.original;

        const handleViewDetails = () => {
            // Implement view details functionality here
        };

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DialogDropdownMenuItem>
                        <UserDialog type={'edit'} selectedUser={user} />
                    </DialogDropdownMenuItem>
                    <DialogDropdownMenuItem>
                        <DeleteUserDialog userId={user.id}/>
                    </DialogDropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleViewDetails}>View User Details</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
};

export const columns = [selectionColumn, // Include the selectionColumn
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                {column.getIsSorted() && (
                    <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${column.getIsSorted() === "asc" ? "rotate-180" : ""
                            }`}
                    />
                )}
            </Button>
        ),
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    actionsColumn,
];
