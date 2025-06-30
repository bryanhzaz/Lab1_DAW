// frontend/src/components/TableComponent.jsx
import React from 'react';
import { useTable, usePagination } from 'react-table';

/**
 * Props:
 *  - columns: array de definiciones [{ Header, accessor }, ...]
 *  - data:    array de objetos a mostrar
 */
export default function TableComponent({ columns, data }) {
  const {
    getTableProps, getTableBodyProps, headerGroups,
    page, nextPage, previousPage, canNextPage, canPreviousPage,
    prepareRow
  } = useTable(
    { columns, data, initialState: { pageSize: 5 } },
    usePagination
  );

  return (
    <>
      <table {...getTableProps()} style={{ width: '100%', marginBottom: 10 }}>
        <thead>
          {headerGroups.map(hg => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map(col => (
                <th {...col.getHeaderProps()}>{col.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={previousPage} disabled={!canPreviousPage}>
        Anterior
      </button>{' '}
      <button onClick={nextPage} disabled={!canNextPage}>
        Siguiente
      </button>
    </>
  );
}
