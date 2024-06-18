import React from "react";
const {
    TableHead,
    TableHeader,
    TableRow,
} = require("@/components/ui/table");

const { flexRender } = require("@tanstack/react-table");


/**
 * Renders the main table header based on the provided table.
 *
 * @param {Object} table - The table object to generate the header for
 * @return {JSX.Element} The rendered table header component
 */
const MainTableHeader = ({ table }) => (
    <TableHeader>
    {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                    {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
            ))}
        </TableRow>
    ))}
</TableHeader>
);

export default MainTableHeader;
