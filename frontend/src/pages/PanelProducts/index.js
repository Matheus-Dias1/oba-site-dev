import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaBoxOpen, FaSignOutAlt, FaChartLine} from 'react-icons/fa';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import ImgApple from '../../assets/product-imgs/apple.jpg';

import { slide as Menu } from 'react-burger-menu';

import './styles.css';
import '../../global.css';


export default function PanelProducts() {

    const [name] = localStorage.getItem('userName').split(" ");
    return (
        <div className="menu-container">
            <Menu isOpen={ false }>
                <h1 className="menu-text">OBA Hortifruti</h1>
                <Link className='menu-link' to="/panel" ><FaHome size={16} color="FFFFFF" />Início</Link>
                <Link className='menu-link' to="/panel/purchases"><FaClipboardCheck size={16} color="FFFFFF" />Pedidos</Link>
                <Link className='menu-link' to="/panel/products"><FaBoxOpen size={16} color="FFFFFF" />Produtos</Link>
                <Link className='menu-link' to="/panel/reports"><FaChartLine size={16} color="FFFFFF" />Relatórios</Link>
            </Menu>
            <div className="panel-container">
                <header>
                    <span>Bem-vindo(a), {name}.</span>
                    <Link className="button" to="/panel/products/new">Cadastrar novo produto</Link>
                    <button type="button">
                        <FaSignOutAlt size={18} color="B30011" />
                    </button>
                </header>
                <h1>Produtos Cadastrados</h1>
                <ul>
                <li>
                        <strong>PRODUTO:</strong>
                        <p>Maçã</p>
                        <strong>DESCRIÇÃO:</strong>
                        <p>teste maça</p>
                        <strong>VALOR:</strong>
                        <p>R$5,00 / R$1,00</p>
                        <strong>UNIDADE:</strong>
                        <p>KG / UN</p>
                        <button type="button">
                            <FiTrash2 size={20} color="a8a8b3" />
                        </button>
                        <button type="button">
                            <FiEdit size={20} color="a8a8b3" className="editButton" />
                        </button>
                        <img src={ImgApple} alt="OBA Hortifruti" width="200px" height="200px"/>

                    </li>
                    <li>
                        <strong>PRODUTO:</strong>
                        <p>Maçã</p>
                        <strong>DESCRIÇÃO:</strong>
                        <p>teste maçaaaaaa aaaa aaaaa aaaa aaaaaaa aa aaa aaaa aaa aaaaaaaa aaaa aaaaa aaaaaaa aaaa aaaaaaaa aaaaaa aaaaa aaaa aaaaa aaaa aaaaaaa aaaaaaaaaa aaaaaaaaaaa aaaaaaa</p>
                        <strong>VALOR:</strong>
                        <p>R$ 5,00 / R$ 1,00</p>
                        <strong>UNIDADE:</strong>
                        <p>KG / UN</p>
                        <button type="button">
                            <FiTrash2 size={20} color="a8a8b3" />
                        </button>
                        <button type="button">
                            <FiEdit size={20} color="a8a8b3" className="editButton" />
                        </button>
                        <img src={ImgApple} alt="OBA Hortifruti" width="200px" height="200px"/>

                    </li>
                    <li>
                        <strong>PRODUTO:</strong>
                        <p>Maçã</p>
                        <strong>DESCRIÇÃO:</strong>
                        <p>teste maça</p>
                        <strong>VALOR:</strong>
                        <p>R$ 5,00 / R$ 1,00</p>
                        <strong>UNIDADE:</strong>
                        <p>KG</p>
                        <button type="button">
                            <FiTrash2 size={20} color="a8a8b3" />
                        </button>
                        <button type="button">
                            <FiEdit size={20} color="a8a8b3" className="editButton" />
                        </button>
                        <img src={ImgApple} alt="OBA Hortifruti" width="200px" height="200px"/>

                    </li>
                    <li>
                        <strong>PRODUTO:</strong>
                        <p>Maçã</p>
                        <strong>DESCRIÇÃO:</strong>
                        <p>teste maça</p>
                        <strong>VALOR:</strong>
                        <p>R$ 5,00 / R$ 1,00</p>
                        <strong>UNIDADE:</strong>
                        <p>KG / UN</p>
                        <button type="button">
                            <FiTrash2 size={20} color="a8a8b3" />
                        </button>
                        <button type="button">
                            <FiEdit size={20} color="a8a8b3" className="editButton" />
                        </button>
                        <img src={ImgApple} alt="OBA Hortifruti" width="200px" height="200px"/>

                    </li>
                </ul>
            </div>
        </div>
    );

}