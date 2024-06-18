import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthUserContext";
import { useToast } from "@/components/ui/use-toast";
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
} from "@tanstack/react-table";
import { Table } from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import globalConfig from '@/globalConfig';

const UserTable = () => {
    const { authUser } = useAuth();
    const { toast } = useToast();

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const usersCollection = db.collection(globalConfig.firestoreCollections.users);
    const queryUsers = usersCollection.where('createdBy', '==', authUser.uid);

    const [usersSnapshot, loadingUsers, errorUsers] = useCollection(queryUsers);

    const usersData = useMemo(() => {
        return usersSnapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() })) || [];
    }, [usersSnapshot]);

    const table = useReactTable({
        data: usersData,
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

    useEffect(() => {
        if (errorUsers) {
            setError(errorUsers);
            setLoading(false);
            toast({
                title: "error",
                description: `Error fetching users: ${errorUsers.message}`,
            });
        } else {
            setLoading(false);
        }
    }, [loadingUsers, errorUsers, toast]);

    return (
        <div>
            <div className="flex items-center py-4">
                <FilterInput table={table} filterBy={"name"} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className=" ml-3 h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().map((column) => (
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
            <div className="rounded-md border">
                <Table>
                    <MainTableHeader table={table} />
                    <MainTableBody table={table} columns={columns} loading={loading || loadingUsers} message={"users"} />
                </Table>
            </div>
            <Pagination table={table} />
        </div>
    );
};

export default UserTable;
