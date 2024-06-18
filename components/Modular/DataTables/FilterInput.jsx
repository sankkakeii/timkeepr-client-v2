import { Input } from '@/components/ui/input'
import React from 'react'

/**
 * Renders an input component for filtering a table by a specified column.
 *
 * @param {Object} table - The table to filter.
 * @param {string} filterBy - The column to filter by.
 * @return {JSX.Element} - The input component for filtering.
 */
const FilterInput = ({ table, filterBy }) => {
    return (
        <Input
            placeholder={`Filter (By ${filterBy})`}
            value={(table.getColumn(`${filterBy}`) && table.getColumn(`${filterBy}`).getFilterValue()) || ""}
            onChange={(event) =>
                table.getColumn(`${filterBy}`) && table.getColumn(`${filterBy}`).setFilterValue(event.target.value)
            }
            className="max-w-sm"
        />
    )
}

export default FilterInput