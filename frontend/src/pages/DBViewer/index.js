import React from 'react';
import { useHistory } from 'react-router-dom';

import './styles.css';
import '../../global.css';
import { useState } from 'react';
import api from '../../services/api'


export default function DBViewer() {
    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken')
    const [columns, setColumns] = useState([]);
    const [column, setColumn] = useState('');
    const [table, setTable] = useState('');
    const [data, setData] = useState([]);
    const [dbKey, setDbKey] = useState('');
    const [raw, setRaw] = useState('');
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }

    async function changeTable(newTable) {
        if (table === newTable) return;
        setTable(newTable);
        setPage(1);
        setOrder('');
        setColumn('');
        try {
            const res = await api.post('/dbquery', {
                rawQuery: '',
                table: newTable,
                orderBy: '',
                order: '',
                page: 1
            }, {
                headers: {
                    authorization: 'Bearer ' + accessToken,
                    dbKey: dbKey
                }
            })
            if (res.data.length > 0)
                setColumns(Object.getOwnPropertyNames(res.data[0]))
            else {
                setColumns([])
            }
            setData(res.data);
            setPage(1);
            setOrder('');
            setColumn('');
            setTotal(res.headers["x-total-count"]);


        } catch (err) {
            alert(err)
        }
    }

    async function nextPage(prevNext) {
        const newPage = prevNext === 'next' ? page + 1 : page - 1;
        try {
            const res = await api.post('/dbquery', {
                rawQuery: '',
                table: table,
                orderBy: column,
                order,
                page: newPage
            }, {
                headers: {
                    authorization: 'Bearer ' + accessToken,
                    dbKey: dbKey
                }
            })
            if (res.data.length > 0)
                setColumns(Object.getOwnPropertyNames(res.data[0]))
            else {
                setColumns([])
            }
            setData(res.data);
            setPage(newPage);
            setTotal(res.headers["x-total-count"]);


        } catch (err) {
            alert(err)
        }
    }

    async function rawQuery() {
        try {
            const res = await api.post('/dbquery', {
                rawQuery: raw,
                table: '',
                orderBy: '',
                order: '',
                page: 0,
            }, {
                headers: {
                    authorization: 'Bearer ' + accessToken,
                    dbKey: dbKey
                }
            })

            setData(res.data);
            setTable('raw');
            setOrder('asc')
            setPage(1);
            setTotal(0);

        } catch (err) {
            alert(err)
        }
    }

    async function orderBy(newColumn) {
        var newOrder;
        if (newColumn === column) {
            newOrder = order === 'asc' ? 'desc' : 'asc'
            setOrder(newOrder);
        }
        else {
            setColumn(newColumn);
            newOrder = 'asc'
            setOrder('asc');
        }
        try {
            const res = await api.post('/dbquery', {
                rawQuery: '',
                table: table,
                orderBy: newColumn,
                order: newOrder,
                page
            }, {
                headers: {
                    authorization: 'Bearer ' + accessToken,
                    dbKey: dbKey
                }
            })

            if (res.data.length > 0)
                setColumns(Object.getOwnPropertyNames(res.data[0]))
            else {
                setColumns([])

            }
            setData(res.data);

        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div className="dbviewer-container">
            <div className="keyInput">
                <input
                    placeholder="key"
                    defaultValue={dbKey}
                    onChange={e => setDbKey(e.target.value)}
                    type="password"
                />
            </div>
            <div className="rawInput">
                <input
                    placeholder="raw query"
                    defaultValue={raw}
                    onChange={e => setRaw(e.target.value)}
                />
                <button
                    className="tableButton"
                    onClick={rawQuery}
                >
                    go
                </button>
            </div>
            <div className="tables-container">
                {
                    [
                        'users',
                        'addresses',
                        'products',
                        'purchases',
                        'productsPurchases',
                        'shopping_carts',
                        'schedule',
                        'cupons'
                    ].map(table => {
                        return (
                            <div className="tableName" key={table}>
                                <button className="tableButton" onClick={() => changeTable(table)}>
                                    {table}
                                </button>
                            </div>
                        )

                    })
                }

            </div>

            <div className="dbviewer-content">


                <table className="dbTable">
                    <thead>
                        <tr>
                            {
                                columns.map(name => (
                                    <th key={name} onClick={() => orderBy(name)}>{name}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(row => (
                                <tr key={data.indexOf(row)}>
                                    {columns.map(column => (
                                        <td key={column + data.indexOf(row)}>{row[column]}</td>
                                    ))}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
            {Math.ceil(total / 25) > 1 && <div className="pageNavContainer">
                <button
                    onClick={() => nextPage('prev')}
                    className={page <= 1 ? 'tableButtonDisabled' : 'tableButton'}
                    disabled={page <= 1}>
                    {'<'}
                </button>

                <p>{`${page}/${Math.ceil(total / 25)}`}</p>

                <button
                    className={page >= Math.ceil(total / 25) ? 'tableButtonDisabled' : 'tableButton'}
                    onClick={() => nextPage('next')}
                    disabled={page >= Math.ceil(total / 25)}>
                    {'>'}
                </button>

            </div>}
        </div>
    );

}