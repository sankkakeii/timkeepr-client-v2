// Pagination.js
import React from "react";
import { Button } from "@/components/ui/button";

/**
 * Renders a pagination component for the given table.
 *
 * @param {object} table - The table object for which the pagination is rendered.
 * @return {JSX.Element} The pagination component JSX.
 */
const Pagination = ({ table }) => (
    <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
        >
            Previous
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
        >
            Next
        </Button>
    </div>
);

export default Pagination;
