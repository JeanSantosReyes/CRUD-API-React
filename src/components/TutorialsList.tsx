// Hooks and Types React
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
// React Router DOM
import { useNavigate } from "react-router-dom";
// Services
import { findItemByTitle, getAllItem, removeAllItems, removeItem } from "../services/TutorialService";
// Interfaces
import ITutorialData from '../types/Tutorial';
// Components
import { Search } from "./Search";
// React tables
import { CellProps, CellValue, Column, useTable } from 'react-table'
// Sweet Alert
import Swal from "sweetalert2";

export const TutorialsList = () => {

  const [tutorials, setTutorials] = useState<Array<ITutorialData>>([]);
  const [searchTitle, setSearchTitle] = useState<string>('');
  const tutorialsRef = useRef<Array<ITutorialData>>([]);
  let navigate = useNavigate();

  tutorialsRef.current = tutorials;

  useEffect(() => {
    retrieveTutorials()
  }, []);

  const onChangeSearchTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveTutorials = () => {
    getAllItem()
      .then(({ data }) => {
        setTutorials(data);
      })
      .catch((e: Error) => console.log(e))
  };

  const refreshList = () => {
    retrieveTutorials();
  };

  const removeAllTutorials = () => {
    removeAllItems()
      .then(() => {
        refreshList();
      })
      .catch((e: Error) => console.log(e));
  };

  const findByTitle = () => {
    findItemByTitle(searchTitle)
      .then(({ data }) => {
        setTutorials(data);
      })
      .catch((e: Error) => console.log(e))
  };

  const openTutorial = (rowIndex: number) => {
    const id = tutorialsRef.current[rowIndex].id;
    navigate('/tutorials/' + id)
  };

  const deleteTutorial = (rowIndex: number) => {
    const id = tutorialsRef.current[rowIndex].id;
    removeItem(id)
      .then(() => {
        Swal.fire(`${tutorialsRef.current[rowIndex].title} successfully deleted.`, '', 'success');

        navigate('/tutorials')
        let newTutorials = [...tutorialsRef.current];
        newTutorials.splice(rowIndex, 1);

        setTutorials(newTutorials);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const columns: Column<ITutorialData>[] = useMemo(() => [
    {
      Header: 'Title',
      accessor: 'title' as keyof ITutorialData,
    },
    {
      Header: 'Description',
      accessor: 'description' as keyof ITutorialData,
    },
    {
      Header: 'Status',
      accessor: 'published' as keyof ITutorialData,
      Cell: ({ value }: CellProps<ITutorialData>): CellValue => {
        return value ? 'Published' : 'Pending';
      }
    },
    {
      Header: 'Actions',
      accessor: 'actions' as CellValue,
      Cell: ({ row }: CellProps<ITutorialData>): JSX.Element => {
        const rowIdx = row.id;
        return (
          <div className='d-flex justify-content-center'>
            <span onClick={() => openTutorial(parseInt(rowIdx))}>
              <i className="far fa-edit action mx-2"></i>
            </span>
            <span onClick={() => deleteTutorial(parseInt(rowIdx))}>
              <i className="fas fa-trash action mx-2"></i>
            </span>
          </div>
        )
      }
    }
    // eslint-disable-next-line
  ], [])

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    rows,
  } = useTable<ITutorialData>({ columns, data: tutorials })

  return (
    <div className="list row">

      <Search searchTitle={searchTitle} onChangeSearchTitle={onChangeSearchTitle} findByTitle={findByTitle} />

      <div className="col-md-12 list">
        <table
          className="table table-striped table-bordered table-hover"
          {...getTableProps()}
        >
          <thead>
            {
              headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>

      <div className="col-md-8">
        <button className="btn btn-sm btn-danger" onClick={removeAllTutorials}>
          Remove All
        </button>
      </div>
    </div>
  )
}
