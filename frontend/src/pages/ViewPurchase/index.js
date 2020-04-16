import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';


import api from '../../services/api';

import './styles.css';
import '../../global.css';


export default function PanelPurchases() {
    const [items, setItems] = useState([]);
    const [client, setClient] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [client_phone, setClient_phone] = useState('');
    const [value, setValue] = useState('');
    const [payment_method, setPayment_method] = useState('');
    const [change, setChange] = useState('');
    const [observation, setObservation] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [idP, setId] = useState('');


    useEffect(() => {

        api.get(`productsPurchases/${window.location.pathname.split("/").pop()}`).then(response => {
            const {
                items,
                data,
            } = response.data;


            const {
                id,
                client,
                street,
                number,
                complement,
                neighborhood,
                delivery_date,
                delivery_time,
                client_phone,
                value,
                payment_method,
                change,
                observation
            } = data;
            setClient(client);
            setStreet(street);
            setNumber(number);
            setComplement(complement);
            setNeighborhood(neighborhood);
            setClient_phone(client_phone);
            setPayment_method(payment_method);
            setObservation(observation);
            setItems(items);

            var fId = String(id) + "", needed = 5 - fId.length;
            if (needed > 0) fId = (Math.pow(10, needed) + "").slice(1) + fId;
            setId(fId);
            setValue(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value));
            setChange(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(change));
            const list = delivery_time.split(':');
            const fTime = list[0] + ':' + list[1];
            setDateTime(Intl.DateTimeFormat('pt-BR').format(new Date(delivery_date)) + ' - ' + fTime);
        })
    }, []);


    return (
        <div className="viewPurchase-container">
            <header>
                <Link className="back-link" to="/panel/purchases">
                    <FaArrowCircleLeft size={30} color="E30016" />
                </Link>
            </header>
            <div className="content">
                <h1>{'Pedido #' + idP}</h1>
                <div className="topInfo">
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>COMPRADOR:</strong></td>
                                <td><p>{client}</p></td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td><strong>ENDEREÇO:</strong></td>
                                <td><p><a href={'https://www.google.com/maps/search/?api=1&query=' + street + '%20' + number + '%2C' + neighborhood} target="_blank" rel="noopener noreferrer">{street + ' ' + number + ' ' + complement + ', ' + neighborhood}</a></p></td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td><strong>ENTREGA:</strong></td>
                                <td><p>{dateTime}</p></td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td><strong>TELEFONE:</strong></td>
                                <td><p>{client_phone}</p></td>
                            </tr>
                        </tbody>
                    </table>

                    <table>
                        <tbody>
                            <tr>
                                <td><strong>VALOR:</strong></td>
                                <td><p>{value}</p></td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td><strong>PAGAMENTO:</strong></td>
                                <td><p>{payment_method}</p></td>
                            </tr>
                        </tbody>
                        <tbody>
                            <tr>
                                <td><strong>TROCO:</strong></td>
                                <td><p>{change}</p></td>
                            </tr>
                        </tbody>

                    </table>

                </div>

                <div className="bottomInfo">
                    <table>
                        <tbody>
                            <tr>
                                <td width="25%"><strong>PRODUTO</strong></td>
                                <td width="15%"><strong>QUANTIDADE</strong></td>
                                <td width="15%"><strong>MEDIDA</strong></td>
                                <td><strong>OBSERVAÇÃO</strong></td>
                            </tr>
                        </tbody>
                        {
                            items.map(item => {
                                return (
                                    <tbody key={items.indexOf(item)}>
                                        <tr>
                                            <td><p>{item.product}</p></td>
                                            <td><p>{String(item.amount).replace('.', ',')}</p></td>
                                            <td><p>{item.unit}</p></td>
                                            <td><p>{item.observation}</p></td>
                                        </tr>
                                    </tbody>
                                )
                            })
                        }
                    </table>
                    {!!observation === true && <div className="obs">
                        <strong><br /><br />OBSERVAÇÕES:</strong>
                        <p>{observation}</p>
                    </div>}
                </div>


            </div>

        </div>

    );

}