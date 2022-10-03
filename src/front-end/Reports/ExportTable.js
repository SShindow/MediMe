import React, { useMemo } from 'react';
import { useTable, useSortBy, useRowSelect } from 'react-table';
import { SOLD_COLUMNS } from './columns.js';
import './Table.css';
import data from './monthly_sales_data.json';

export const ImportTable = () => { 
    const columns = useMemo(() => SOLD_COLUMNS, [])
    // const data = useMemo(() => MOCK_DATA, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable (
            { columns, data, initialState: { pageIndex: 0 }},
            useSortBy,
            useRowSelect
        )
      
    return (
        <div className="import-table">
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {
                                headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                        </span>
                                    </th>
                                ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}

                            </tr>
                        )
                    })}                                    
                </tbody> 
            </table>
        </div>
    )
}

export default ExportTable;
