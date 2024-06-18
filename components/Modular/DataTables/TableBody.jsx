import React, { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
const { flexRender } = require("@tanstack/react-table");

const {
    TableBody,
    TableCell,
    TableRow,
} = require("@/components/ui/table");

/**
 * Renders the body of the main table based on the provided table, columns, loading status, and message.
 *
 * @param {object} table - The table object
 * @param {array} columns - The array of table columns
 * @param {boolean} loading - The loading status
 * @param {string} message - The message to display when no data is found
 */
const MainTableBody = ({ table, columns, loading, message }) => (

    <TableBody>
        {loading ? (
            <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    <Spinner />
                </TableCell>
            </TableRow>
        ) : (
            table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                        <p>No {message} found.</p>
                    </TableCell>
                </TableRow>
            )
        )}
    </TableBody>
);

export default MainTableBody;
