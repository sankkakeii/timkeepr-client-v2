import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast"; // Import the toast notification hook
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Pagination from "../Pagination";
import FilterInput from "../FilterInput";
import MainTableHeader from "../TableHeader";
import MainTableBody from "../TableBody";
import { Table } from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import globalConfig from "@/globalConfig";
const {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    getSortedRowModel,
} = require("@tanstack/react-table"); // Import necessary functions from tanstack/react-table library

/**
 * `TaskTable` component renders a table of tasks using tanstack/react-table library.
 *
 * This component fetches task data from Firestore, initializes the table using tanstack/react-table,
 * and displays a paginated and filterable table of tasks.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.activeTeam - The currently active team.
 */
const TaskTable = ({ activeTeam }) => {

    // Toast notification hook
    const { toast } = useToast();

    // State for loading status and tasks data
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});

    // Reference to the team document in Firestore
    const teamRef = db.collection(globalConfig.firestoreCollections.teams).doc(activeTeam?.value?.id);

    // Fetch team data using Firestore hook
    const [teamSnapshot, loadingTeam, errorTeam] = useDocument(teamRef);

    // Extract tasks data from team snapshot
    const tasksData = useMemo(() => {
        const teamData = teamSnapshot?.data();
        return teamData?.tasks || [];
    }, [teamSnapshot]);

    // Handle team loading and error states
    useEffect(() => {
        if (errorTeam) {
            setLoading(false);
            toast({
                title: "error",
                description: `Error fetching team: ${errorTeam.message}`,
            });
        } else {
            setLoading(loadingTeam);
        }
    }, [loadingTeam, errorTeam, toast]);

    // Initialize the table using tanstack/react-table
    const table = useReactTable({
        data: tasksData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    });

    // Render the table component
    return (
        <div>
            {/* Filter input and dropdown for column visibility */}
            <div className="flex items-center py-4">
                <FilterInput table={table} filterBy={'taskName'} />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className=" ml-3 h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* Checkbox items for each column to toggle visibility */}
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={columnVisibility[column.id] !== false}
                                    onCheckedChange={(value) =>
                                        setColumnVisibility((prev) => ({
                                            ...prev,
                                            [column.id]: !!value,
                                        }))
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            {/* Table component with header, body, and pagination */}
            <div className="rounded-md border">
                <Table>
                    <MainTableHeader table={table} />
                    <MainTableBody table={table} columns={columns} loading={loading} message={'tasks'} />
                </Table>
            </div>
            {/* Pagination component */}
            <Pagination table={table} />
        </div>
    );
};

export default TaskTable;
