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
    const [order, setOrder] = useState('asc');

    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }

    async function changeTable(newTable) {
        if (table === newTable) return;
        setTable(newTable);
        try {
            const res = await api.post('/dbquery', {
                rawQuery: '',
                table: newTable,
                orderBy: '',
                order: ''
            }, {
                headers: {
                    authorization: 'Bearer ' + accessToken,
                    dbKey: ''
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

    async function orderBy(newColumn){
        var newOrder;
        if (newColumn === column){
            newOrder = order === 'asc' ? 'desc' : 'asc'
            setOrder(newOrder);
        }
        else{
            setColumn(newColumn);
            newOrder = 'asc'
            setOrder('asc');
        }
        try {
            const res = await api.post('/dbquery', {
                rawQuery: '',
                table: table,
                orderBy: newColumn,
                order: newOrder
            }, {
                headers: {
                    authorization: 'Bearer ' + accessToken,
                    dbKey: ''
                }
            })
            console.log(res.data)
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
                                    <th key={name} onClick={()=>orderBy(name)}>{name}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(row => (
                                <tr key={data.indexOf(row)}>
                                    {columns.map(column => (
                                        <td nameClass="dbtb"key={column + data.indexOf(row)}>{row[column]}</td>
                                    ))}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );

}