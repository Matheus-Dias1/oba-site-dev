import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';



import api from '../../services/api';

import './styles.css';


export default function PrintPurchases() {
    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }
    const [purchases, setPurchases] = useState([]);



    useEffect(() => {
        try {
            api.get('productsPurchases/all', {
                headers: {
                    authorization: 'Bearer ' + accessToken,
                }
            }).then(response => {
                setPurchases(response.data);
                window.print();
                history.push('/panel/purchases');
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            })
        } catch (err) {
            alert('Erro ao recuperar pedidos');
        }
    }, [history, accessToken]);


    return (
        <div className="printPurchase-container">
            {
                purchases.map(purchase => {
                    function formatId(id) {
                        var fId = String(id) + "", needed = 5 - fId.length;
                        if (needed > 0) fId = (Math.pow(10, needed) + "").slice(1) + fId;
                        return fId;
                    }
                    function formatDateTime(date, period) {

                        return Intl.DateTimeFormat('pt-BR').format(new Date(date)) + (period === 'morning' ? ' - Manhã' : (period === 'afternoon' ? ' - Tarde' : ' - Noite'))

                    }

                    try {
                        const obsData = JSON.parse(purchase.data.observation);
                        if (Object.keys(obsData).length < 8)
                            throw new Error()
                        return (
                            <div className="content" key={purchases.indexOf(purchase)}>
                                <h1>{'Pedido #' + formatId(purchase.data.id)}</h1>
                                <div className="topInfo">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><strong>COMPRADOR:</strong></td>
                                                <td><p>{obsData.client}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                <td><strong>ENDEREÇO:</strong></td>
                                                <td><p>{obsData.street + ' ' + obsData.number + ' ' + obsData.complement + ', ' + obsData.neighborhood + ', ' + obsData.city}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                <td><strong>ENTREGA:</strong></td>
                                                <td><p>{formatDateTime(purchase.data.delivery_date, purchase.data.delivery_period)}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                <td><strong>TELEFONE:</strong></td>
                                                <td><p>{obsData.phone}</p></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><strong>VALOR:</strong></td>
                                                <td><p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.data.value)}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                <td><strong>PAGAMENTO:</strong></td>
                                                <td><p>{purchase.data.payment_method}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                {purchase.data.payment_method === 'Dinheiro' && <td><strong>TROCO:</strong></td>}
                                                {purchase.data.payment_method === 'Dinheiro' && <td><p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.data.change)}</p></td>}
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
                                            purchase.items.map(item => {
                                                return (
                                                    <tbody key={purchase.items.indexOf(item)}>
                                                        <tr>
                                                            <td><p>{item.product}</p></td>
                                                            <td><p>{String(item.amount).replace(/\./g, '*').replace(/,/g, '.').replace(/\*/g, ',')}</p></td>
                                                            <td><p>{item.unit}</p></td>
                                                            <td><p>{item.observation}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )
                                            })
                                        }
                                    </table>
                                    {!!obsData.observation === true && <div className="obs">
                                        <strong><br /><br />OBSERVAÇÕES:</strong>
                                        <p>{obsData.observation}</p>
                                    </div>}
                                </div>



                            </div>
                        )
                    } catch (err) {
                        return (
                            <div className="content" key={purchases.indexOf(purchase)}>
                                <h1>{'Pedido #' + formatId(purchase.data.id)}</h1>
                                <div className="topInfo">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><strong>COMPRADOR:</strong></td>
                                                <td><p>{purchase.data.client}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                <td><strong>ENDEREÇO:</strong></td>
                                                <td><p>{purchase.data.street + ' ' + purchase.data.number + ' ' + purchase.data.complement + ', ' + purchase.data.neighborhood + ', ' + purchase.data.city}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                <td><strong>ENTREGA:</strong></td>
                                                <td><p>{formatDateTime(purchase.data.delivery_date, purchase.data.delivery_period)}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                <td><strong>TELEFONE:</strong></td>
                                                <td><p>{purchase.data.client_phone}</p></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><strong>VALOR:</strong></td>
                                                <td><p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.data.value)}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                <td><strong>PAGAMENTO:</strong></td>
                                                <td><p>{purchase.data.payment_method}</p></td>
                                            </tr>
                                        </tbody>
                                        <tbody>
                                            <tr>
                                                {purchase.data.payment_method === 'Dinheiro' && <td><strong>TROCO:</strong></td>}
                                                {purchase.data.payment_method === 'Dinheiro' && <td><p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.data.change)}</p></td>}
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
                                            purchase.items.map(item => {
                                                return (
                                                    <tbody key={purchase.items.indexOf(item)}>
                                                        <tr>
                                                            <td><p>{item.product}</p></td>
                                                            <td><p>{String(item.amount).replace(/\./g, '*').replace(/,/g, '.').replace(/\*/g, ',')}</p></td>
                                                            <td><p>{item.unit}</p></td>
                                                            <td><p>{item.observation}</p></td>
                                                        </tr>
                                                    </tbody>
                                                )
                                            })
                                        }
                                    </table>
                                    {!!purchase.data.observation === true && <div className="obs">
                                        <strong><br /><br />OBSERVAÇÕES:</strong>
                                        <p>{purchase.data.observation}</p>
                                    </div>}
                                </div>



                            </div>
                        )
                    }
                })
            }
        </div>
    );

}