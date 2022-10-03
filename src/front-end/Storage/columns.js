import { format } from 'date-fns'

export const COLUMNS = [
    {
        Header: 'Id',
        Footer: 'Id',
        accessor: 'product_id',
    },
    {
        Header: 'Product Name',
        Footer: 'Product Name',
        accessor: 'product_name',

    },
    {
        Header: 'In Stock',
        Footer: 'In Stock',
        accessor: 'quantity',

    },
    {
        Header: 'Expiry Date',
        Footer: 'Expiry Date',
        accessor: 'expiring_date',


        // Cannot use sort for Date of Expire (BUG)
        // Cell: ({ value }) => { return format(new Date(value), 'dd/MM/yyyy')}
    },
    {
        Header: 'Status',
        Footer: 'Status',
        accessor: 'status',

    },
    {
        Header: 'Price',
        Footer: 'Price',
        accessor: 'price',

    }

]
