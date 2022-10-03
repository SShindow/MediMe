import React, { useMemo, useEffect, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter, usePagination, useRowSelect } from 'react-table'
import MOCK_DATA from './data.json'
import { COLUMNS } from './columns.js'
import './Table.css'
import { Checkbox } from './CheckBox'
import { GlobalFilter } from './GlobalFilter.js'
import invoice_data from '../Reports/invoice_data.json'
import { query, collection, getDocs, where } from "firebase/firestore";
import { postData, response } from 'har-validator'
import { get } from 'lodash'


async function callAPI() {
    //const [email, setEmail] = useState("");

    //await fetch("http://localhost:8080/products/updateexpiringdate");
    /*
      try {
          const q = query(collection(db, "users"), where("uid", "==", user?.uid));
          const doc = await getDocs(q);
          const data = doc.docs[0].data();
          setEmail(data.email);
          console.log(email);
          await fetch("http://localhost:8080/products/branch/getproduct/" + email);///tainguyen@gmail.com");
      } catch (err) {
          console.error(err);
      }
    */
    //await fetch("http://localhost:8080/products/updateexpiringdate");
    // await fetch("http://localhost:8080/employee/add/address 2/Employee/tainguyenavo06022001@gmail.com");
}

export const CompleteTable = () => {
    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => MOCK_DATA, [])



    async function callAPI() {
        //const [email, setEmail] = useState("");

        //await fetch("http://localhost:8080/products/updateexpiringdate");
        /*
          try {
              const q = query(collection(db, "users"), where("uid", "==", user?.uid));
              const doc = await getDocs(q);
              const data = doc.docs[0].data();
              setEmail(data.email);
              console.log(email);
              await fetch("http://localhost:8080/products/branch/getproduct/" + email);///tainguyen@gmail.com");
          } catch (err) {
              console.error(err);
          }
        */
        //await fetch("http://localhost:8080/products/updateexpiringdate");
        await fetch("http://localhost:8080/products/branch/getproduct/minhdeptrai4869@gmail.com").then((response) => response.json().then((data) => console.log(data)));
    }

    async function UpdateStock() {
        // const data = useMemo(() => MOCK_DATA, [])
        await fetch("http://localhost:8080/invoice/create",
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        for (let i = 0; i < data.length; i++) {
            if (document.getElementById("export-value-" + data[i].product_id).value != 0) {
                // console.log('http://localhost:8080/customer/export/minhdeptrai4869@gmail.com/' + data[i].product_id + '/null/' + document.getElementById("export-value-" + data[i].product_id).value);
                const res = await fetch('http://localhost:8080/customer/export/minhdeptrai4869@gmail.com/' + await data[i].product_id + '/0355491721/' + document.getElementById("export-value-" + data[i].product_id).value,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                // .then((response) => response.json().then((data) => console.log(data)));
                console.log(res)
                // setNum(i);
            }
        }
        await window.open("http://localhost:8080/invoice/now");
        callAPI();
        
    }

    const defaultColumn = useMemo(() => {
        return {
            Filter: GlobalFilter,
        }
    }, [])

    const getInputValue = (event) => {
        // show the user input value to console
        console.log(document.getElementById('export-value-fdcac8bf-dfc0-11ec-b414-061bce7f90f2').value);

    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
        page,
        nextPage,
        previousPage,
        pageOptions,
        gotoPage,
        pageCount,
        canNextPage,
        canPreviousPage,
        setPageSize,
        selectedFlatRows
    } = useTable({
        columns,
        data,
        defaultColumn,
        initialState: { pageIndex: 0 }
    },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => {
                return [
                    {
                        id: 'selection',
                        Header: ({ getToggleAllRowsSelectedProps }) => (
                            <Checkbox {...getToggleAllRowsSelectedProps()} />
                        ),
                        Cell: ({ row }) => (
                            <Checkbox {...row.getToggleRowSelectedProps()} />
                        )
                    },
                    ...columns,
                    {
                        id: 'export',
                        Header: 'Export',
                        Cell: ({ row }) => (
                            <span>
                                <input id={'export-value-' + row.original.product_id} type='number' defaultValue={0} onChange={getInputValue} max={row.original.quantity} min='0' style={{ width: '65px' }}></input >
                            </span>
                        )
                    }
                ]
            })
        }
    )

    const { globalFilter, pageIndex, pageSize } = state
    useEffect(() => {
        callAPI();
    }, []);


    return (
        <>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <button class="btn-hover color-1" onClick={UpdateStock}>Update Stock</button>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
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
                    {page.map((row) => {
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
            <div>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </span>
                <span>
                    | Go to Page: {' '}
                    <input type='number' min={1} max={pageOptions.length} defaultValue={pageIndex + 1}
                        onChange={e => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(pageNumber)
                        }}
                        style={{ width: '50px' }}
                    />
                </span>
                <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
                    {
                        [10, 25, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))
                    }
                </select>

                <button
                    onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >Previous
                </button>

                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                >Next
                </button>
                <button
                    onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
            </div>


            {/* <pre>
                <code>
                    {JSON.stringify(
                        {
                            selectedFlatRows: selectedFlatRows.map((row) => row.original),
                        },
                        null,
                        2
                    )}
                </code>
            </pre> */}
        </>
    )


}


export default CompleteTable;

/*  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },*/
