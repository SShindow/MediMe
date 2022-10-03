import { format } from 'date-fns'

/* IMPORT TABLE COLUMNS */

// Check use sort for Import Date later
// Cell: ({ value }) => { return format(new Date(value), 'dd/MM/yyyy')}

export const IMPORT_COLUMNS = [
    {
        Header: 'Import No.',
        // Footer: 'Import No.',
        accessor: 'import_no',
    },
    {
        Header: 'Lot ID',
        // Footer: 'Lot ID',
        accessor: 'lot_id',

    },
    {
        Header: 'Product ID',
        // Footer: 'Product ID',
        accessor: 'product_id',

    },
    {
        Header: 'Quantity',
        // Footer: 'Quantity',
        accessor: 'quantity',

    },
    {
        Header: 'Import Date',
        // Footer: 'Import Date',
        accessor: 'import_date',
    }

]

/* SOLD TABLE COLUMNS */

// Check use sort for Export Date later
// Cell: ({ value }) => { return format(new Date(value), 'dd/MM/yyyy')}

export const SOLD_COLUMNS = [
    /*
    {
        Header: 'Export No.',
        Footer: 'Export No.',
        accessor: 'export_no',
    },
    */
    {
        Header: 'Invoice ID',
        // Footer: 'Invoice ID',
        accessor: 'invoice_id',

    },
    {
        Header: 'Product ID',
        // Footer: 'Product ID',
        accessor: 'product_id',

    },
    {
        Header: 'Quantity',
        // Footer: 'Quantity',
        accessor: 'quantity',

    },
    {
        Header: 'Export Date',
        // Footer: 'Export Date',
        accessor: 'export_date',
    },
    {
        Header: 'Employee ID',
        // Footer: 'Employee ID',
        accessor: 'employee_id',

    }

]