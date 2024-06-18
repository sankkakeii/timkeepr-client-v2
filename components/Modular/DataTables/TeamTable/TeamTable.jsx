import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthUserContext"; // Import the authentication context hook
import { useToast } from "@/components/ui/use-toast"; // Import the toast notification hook
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
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
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    getSortedRowModel,
} from "@tanstack/react-table"; // Import necessary functions from tanstack/react-table library
import { Table } from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import globalConfig from "@/globalConfig";

/**
 * `TeamTable` component renders a table of teams using tanstack/react-table library.
 *
 * This component fetches team data from Firestore, initializes the table using tanstack/react-table,
 * and displays a paginated and filterable table of teams based on the user's membership and created teams.
 */
const TeamTable = () => {
    // Authentication context hook
    const { authUser } = useAuth();

    // Toast notification hook
    const { toast } = useToast();

    // State for sorting, column filters, and column visibility
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});

    // State for loading status and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Firestore collection references for user teams and created teams
    const teamsCollection = db.collection(globalConfig.firestoreCollections.teams);
    const queryUserTeams = teamsCollection.where('members', 'array-contains', authUser.uid);
    const queryCreatedTeams = teamsCollection.where('createdBy', '==', authUser.uid);

    // Fetch user teams and created teams using Firestore hooks
    const [userTeamsSnapshot, loadingUserTeams, errorUserTeams] = useCollection(queryUserTeams);
    const [createdTeamsSnapshot, loadingCreatedTeams, errorCreatedTeams] = useCollection(queryCreatedTeams);

    // Memoized data for user teams and created teams
    const userTeamsData = useMemo(() => {
        return userTeamsSnapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || [];
    }, [userTeamsSnapshot]);

    const createdTeamsData = useMemo(() => {
        return createdTeamsSnapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || [];
    }, [createdTeamsSnapshot]);

    // Combine user teams and created teams into a single data array
    const memoizedTeamsData = useMemo(() => {
        return [...userTeamsData, ...createdTeamsData];
    }, [userTeamsData, createdTeamsData]);

    // Initialize the table using tanstack/react-table
    const table = useReactTable({
        data: memoizedTeamsData,
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

    // Handle loading and error states
    useEffect(() => {
        if (errorUserTeams || errorCreatedTeams) {
            setError(errorUserTeams || errorCreatedTeams);
            setLoading(false);
            toast({
                title: "error",
                description: `Error fetching teams: ${errorUserTeams?.message || errorCreatedTeams?.message}`,
            });
        } else {
            setLoading(false);
        }
    }, [loadingUserTeams, errorUserTeams, loadingCreatedTeams, errorCreatedTeams, toast]);

    // Render the component
    return (
        <div>
            {/* Filter input and dropdown for column visibility */}
            <div className="flex items-center py-4">
                <FilterInput table={table} filterBy={"teamName"} />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className=" ml-3 h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">

                        {/* Checkbox items for each column to toggle visibility */}
                        {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
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
                    <MainTableBody table={table} columns={columns} loading={loading || loadingUserTeams || loadingCreatedTeams} message={"teams"} />
                </Table>
            </div>
            {/* Pagination component */}
            <Pagination table={table} />
        </div>
    );
};

export default TeamTable;
