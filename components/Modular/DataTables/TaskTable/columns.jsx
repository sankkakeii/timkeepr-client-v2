import React, { useState } from "react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DialogDropdownMenuItem,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteTaskDialog } from "../../admin/Dialogs/DeleteDialogs/DeleteTaskDialog";
import { useTeam } from "@/context/TeamContext";
import { TaskDialog } from "../../admin/Dialogs/TaskDialog";

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

// Task columns
const taskColumns = [
    {
        accessorKey: "taskName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                {column.getIsSorted() && (
                    <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${column.getIsSorted() === "asc" ? "rotate-180" : ""}`}
                    />
                )}
            </Button>
        ),
    },
    {
        accessorKey: "assignedUserName",
        header: "Assignee",
    },
];

// Additional column for actions
const actionsColumn = {
    id: "actions",
    cell: ({ row }) => {
        // Assuming each item has an 'id' property
        const item = row.original;
        const { activeTeam } = useTeam();

        return (
            <>
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
                            <TaskDialog type={'edit'} selectedItem={item} activeTeam={activeTeam} />
                        </DialogDropdownMenuItem>
                        <DialogDropdownMenuItem>
                            <DeleteTaskDialog selectedItem={item} activeTeam={activeTeam} />
                        </DialogDropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </>
        );
    },
};

// Combining columns with actions column and selection column
export const columns = [selectionColumn, ...taskColumns, actionsColumn];
