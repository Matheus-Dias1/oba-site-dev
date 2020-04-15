import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaBoxOpen, FaSignOutAlt, FaTruck, FaChartLine, FaClipboardList } from 'react-icons/fa';
import { slide as Menu } from 'react-burger-menu';

import api from '../../services/api';

import './styles.css';
import '../../global.css';


export default function PanelPurchases() {
    const [name] = localStorage.getItem('userName').split(" ");
    const [purchases, setPurchases] = useState([]);
    const history = useHistory();

    useEffect(() => {
        api.get('purchases').then(response => {
            setPurchases(response.data);
        });

    }, [name]);

    function handleDelivered(id) {
        const data = { id: id };
        try {
            api.put('purchases/delivery', data);
            setPurchases(purchases.filter(purchase => purchase.id !== id));
        } catch (err) {
            alert('Erro ao marcar compra como entrege.');
        }
    }

    function handleClipboard(id){
        history.push(`purchases/view/${id}`);
    }

    return (
        <div className="menu-container">
            <Menu isOpen={false}>
                <h1 className="menu-text">OBA Hortifruti</h1>
                <Link className='menu-link' to="/panel" ><FaHome size={16} color="FFFFFF" />Início</Link>
                <Link className='menu-link' to="/panel/purchases"><FaClipboardCheck size={16} color="FFFFFF" />Pedidos</Link>
                <Link className='menu-link' to="/panel/products"><FaBoxOpen size={16} color="FFFFFF" />Produtos</Link>
                <Link className='menu-link' to="/panel/reports"><FaChartLine size={16} color="FFFFFF" />Relatórios</Link>

            </Menu>
            <div className="purchase-container">
                <header>
                    <span>Bem-vindo(a), {name}.</span>
                    <Link className="button" to="/panel/purchases">Imprimir pedidos</Link>
                    <Link className="button" to="/panel/purchases/new">Cadastrar novo pedido</Link>
                    <button type="button">
                        <FaSignOutAlt size={18} color="B30011" />
                    </button>
                </header>
                <h1>Pedidos em andamento</h1>
                <ul>
                    {
                        purchases.map(purchase => {

                            function dateFormater(date) {
                                return Intl.DateTimeFormat('pt-BR').format(new Date(purchase.delivery_date));
                            }
                            function timeFormater(time) {
                                const list = time.split(':');
                                return list[0] + ':' + list[1]
                            }

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
                                        <strong>ENDEREÇO:</strong>
                                        <p>{purchase.street + ' ' + purchase.number + ', ' + purchase.neighborhood}</p>
                                        <strong>ENTREGA:</strong>
                                        <p>{dateFormater(purchase.delivery_date) + ' - ' + timeFormater(purchase.delivery_time)}</p>
                                        <strong>OBSERVAÇÕES:</strong>
                                        <p>{purchase.observation}</p>
                                    </div>

                                    <button type="button" onClick={() => handleDelivered(purchase.id)}>
                                        <FaTruck size={20} color="a8a8b3" />
                                    </button>
                                    <button type="button" className="listButton" onClick={ () => handleClipboard(purchase.id)}>
                                        <FaClipboardList size={20} color="a8a8b3" />
                                    </button>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    );

}