import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaBoxOpen, FaSignOutAlt, FaTruck, FaChartLine , FaClipboardList} from 'react-icons/fa';
import { slide as Menu } from 'react-burger-menu';

//import api from '../../services/api';

import './styles.css';
import '../../global.css';


export default function PanelPurchases() {
    const [name] = localStorage.getItem('userName').split(" ");
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
                <li>
                        <div>
                            <strong>COMPRADOR:</strong>
                            <p>Matheus Dias</p>
                            <strong>PAGAMENTO:</strong>
                            <p>Dinheiro</p>
                            <strong>VALOR:</strong>
                            <p>R$35,00</p>
                            <strong>TROCO:</strong>
                            <p>R$ 15,00</p>
                        </div>
                        <div>
                            <strong>ENDEREÇO:</strong>
                            <p>Morum Bernardino 250</p>
                            <strong>ENTREGA:</strong>
                            <p>15/04/2020</p>
                            <strong>OBSERVAÇÕES:</strong>
                            <p>Não entregar na parte da manhã, não tem ninguém em casa, bla bla  bla bla  bla bla  bla bla  bla bla  bla bla  bla bla  bla bla  bla bla  bla bla  bla bla  bla bla </p>
                        </div>

                        <button type="button">
                            <FaTruck size={20} color="a8a8b3" />
                        </button>
                        <button type="button" className="listButton">
                            <FaClipboardList size={20} color="a8a8b3" />
                        </button>
                    </li>                   
                </ul>
            </div>
        </div>
    );

}