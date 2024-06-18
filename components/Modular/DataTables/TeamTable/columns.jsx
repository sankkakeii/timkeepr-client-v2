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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/router';  // Import useRouter
import { DeleteTeamDialog } from "../../admin/Dialogs/DeleteDialogs/DeleteTeamDialog";
import { TeamDialog } from "../../admin/Dialogs/TeamDialog";

// Additional column for row selection
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

// Existing columns
const existingColumns = [
    {
        accessorKey: "teamName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
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
        accessorKey: "owner",
        header: "Owner",
    },
    {
        accessorKey: "department",
        header: "Department",
    },
];

// Additional column for actions
const actionsColumn = {
    id: "actions",
    cell: ({ row }) => {
        const item = row.original;
        const router = useRouter();

        const handleViewDetails = () => {
            router.push(`/_admin/team/${item.id}`);
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
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(item.id)}
                    >
                        Copy Team ID
                    </DropdownMenuItem>
                    <DialogDropdownMenuItem>
                        <TeamDialog type={'edit'} teamData={item} />
                    </DialogDropdownMenuItem>
                    <DialogDropdownMenuItem>
                        <DeleteTeamDialog teamId={item.id} />
                    </DialogDropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleViewDetails}>View Team Details</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    },
};

// Combining existing columns with actions column and selection column
export const columns = [selectionColumn, ...existingColumns, actionsColumn];
