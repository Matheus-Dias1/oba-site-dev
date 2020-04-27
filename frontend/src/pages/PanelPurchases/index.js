import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaBoxOpen, FaSignOutAlt, FaTruck, FaCalendarAlt, FaChartLine, FaClipboardList } from 'react-icons/fa';
import { slide as Menu } from 'react-burger-menu';

import api from '../../services/api';

import './styles.css';
import '../../global.css';


export default function PanelPurchases() {
   
    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }
    try {
        var [name] = localStorage.getItem('userName').split(" ");
    } catch (err) {
        history.push('/');
    }
    const [purchases, setPurchases] = useState([]);


    useEffect(() => {
        try {
            api.get('purchases', {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).then(response => {
                setPurchases(response.data);
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            });
        } catch (err) {
            alert('Erro ao carregar pedidos.')
        }

    }, [name, history, accessToken]);

    function handleDelivered(id) {
        if (window.confirm('Deseja marcar pedido como entregue?\nPedidos marcados como entregues não poderão ser acessados pelo painel.')) {
            const data = { id: id };
            try {
                api.put('purchases/delivery', data, {
                    headers: {
                        authorization: 'Bearer ' + accessToken
                    }
                }).catch(err => {
                    if (err.response.status === 401 || err.response.status === 403) {
                        alert('Você não tem permissão para acessar essa página');
                        history.push('/');
                    } else throw err;
                });
                setPurchases(purchases.filter(purchase => purchase.id !== id));
            } catch (err) {
                alert('Erro ao marcar compra como entregue.');
            }
        }
    }

    function handleClipboard(id) {
        history.push(`purchases/view/${id}`);
    }

    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }

    return (
        <div className="menu-container">
            <Menu isOpen={false}>
                <h1 className="menu-text">OBA Hortifruti</h1>
                <Link className='menu-link' to="/panel" ><FaHome size={16} color="FFFFFF" />Início</Link>
                <Link className='menu-link' to="/panel/purchases"><FaClipboardCheck size={16} color="FFFFFF" />Pedidos</Link>
                <Link className='menu-link' to="/panel/products"><FaBoxOpen size={16} color="FFFFFF" />Produtos</Link>
                <Link className='menu-link' to="/panel/reports"><FaChartLine size={16} color="FFFFFF" />Relatórios</Link>
                <Link className='menu-link' to="/panel/schedule"><FaCalendarAlt size={16} color="FFFFFF" />Adicionar Horários</Link>

            </Menu>
            <div className="purchase-container">
                <header>
                    <span>Bem-vindo(a), {name}.</span>
                    <Link className="button" to="/panel/purchases/print">Imprimir pedidos</Link>
                    <Link className="button" to="/panel/purchases/new/products">Cadastrar novo pedido</Link>
                    <button type="button" onClick={() => handleLogout()}>
                        <FaSignOutAlt size={18} color="B30011" />
                    </button>
                </header>
                <h1>Pedidos em andamento</h1>
                <ul>
                    {
                        purchases.map(purchase => {

                            try {
                                const obsData = JSON.parse(purchase.observation);
                                return (
                                    <li key={purchase.id}>
                                        <div>
                                            <strong>COMPRADOR:</strong>
                                            <p>{obsData.client}</p>
                                            <strong>PAGAMENTO:</strong>
                                            <p>{purchase.payment_method}</p>
                                            <strong>VALOR:</strong>
                                            <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.value)}</p>
                                            <strong>TROCO:</strong>
                                            <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.change)}</p>
                                        </div>
                                        <div>
                                            <a href={'https://www.google.com/maps/search/?api=1&query=' + obsData.street + '%20' + obsData.number + '%2C' + obsData.neighborhood + '%20' + purchase.city} target="_blank" rel="noopener noreferrer">
                                                <strong>ENDEREÇO:</strong>
                                                <p>{obsData.street + ' ' + obsData.number + ', ' + obsData.neighborhood} </p>
                                            </a>
                                            <strong>ENTREGA:</strong>
                                            <p>{dateFormater(purchase.delivery_date) + ' - ' + (purchase.delivery_period === 'morning' ? 'Manhã' : 'Tarde')}</p>
                                            <strong>OBSERVAÇÕES:</strong>
                                            <p>{obsData.observation}</p>
                                        </div>

                                        <button type="button" onClick={() => handleDelivered(purchase.id)}>
                                            <FaTruck size={20} color="a8a8b3" />
                                        </button>
                                        <button type="button" className="listButton" onClick={() => handleClipboard(purchase.id)}>
                                            <FaClipboardList size={20} color="a8a8b3" />
                                        </button>
                                    </li>
                                )
                            } catch (err) {
                                return (
                                    <li key={purchase.id}>
                                        <div>
                                            <strong>COMPRADOR:</strong>
                                            <p>{purchase.client}</p>
                                            <strong>PAGAMENTO:</strong>
                                            <p>{purchase.payment_method}</p>
                                            <strong>VALOR:</strong>
                                            <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.value)}</p>
                                            <strong>TROCO:</strong>
                                            <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.change)}</p>
                                        </div>
                                        <div>
                                            <a href={'https://www.google.com/maps/search/?api=1&query=' + purchase.street + '%20' + purchase.number + '%2C' + purchase.neighborhood + '%20' + purchase.city} target="_blank" rel="noopener noreferrer">
                                                <strong>ENDEREÇO:</strong>
                                                <p>{purchase.street + ' ' + purchase.number + ', ' + purchase.neighborhood} </p>
                                            </a>
                                            <strong>ENTREGA:</strong>
                                            <p>{dateFormater(purchase.delivery_date) + ' - ' + (purchase.delivery_period === 'morning' ? 'MANHÃ' : 'TARDE')}</p>
                                            <strong>OBSERVAÇÕES:</strong>
                                            <p>{purchase.observation}</p>
                                        </div>

                                        <button type="button" onClick={() => handleDelivered(purchase.id)}>
                                            <FaTruck size={20} color="a8a8b3" />
                                        </button>
                                        <button type="button" className="listButton" onClick={() => handleClipboard(purchase.id)}>
                                            <FaClipboardList size={20} color="a8a8b3" />
                                        </button>
                                    </li>
                                )
                            }

                            function dateFormater(date) {
                                console.log(purchase.delivery_date)
                                console.log(new Date(purchase.delivery_date));
                                return Intl.DateTimeFormat('pt-BR').format(new Date(purchase.delivery_date));
                            }


                        })
                    }
                </ul>
            </div>
        </div>
    );

}