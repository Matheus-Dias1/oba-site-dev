import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaBoxOpen, FaSignOutAlt, FaChartLine } from 'react-icons/fa';
import { FiTrash2, FiEdit } from 'react-icons/fi';


import { slide as Menu } from 'react-burger-menu';

import api from '../../services/api';

import './styles.css';
import '../../global.css';


export default function PanelProducts() {

    const [name] = localStorage.getItem('userName').split(" ");
    const [userId] = localStorage.getItem('userId').split(" ");
    const url = 'http://localhost:3333/image/';
    const [products, setProducts] = useState([]);

    const history = useHistory();


    useEffect(() => {
        api.get('products').then(response => {
            setProducts(response.data);
        })
    }, [name]);

    async function handleDeleteProduct(id) {
        try {
            await api.delete(`products/${id}`, {
                headers: {
                    authorization: userId
                }
            });
            setProducts(products.filter(product => product.id !== id));
        } catch (err) {
            alert('Erro ao deletar produto.');
        }
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
            </Menu>
            <div className="panel-container">
                <header>
                    <span>Bem-vindo(a), {name}.</span>
                    <Link className="button" to="/panel/products/new">Cadastrar novo produto</Link>
                    <button type="button" onClick={handleLogout}>
                        <FaSignOutAlt size={18} color="B30011" />
                    </button>
                </header>
                <h1>Produtos Cadastrados</h1>
                <ul>
                    {
                        products.map(product => {
                            var up;
                            if (product.unit_price === null)
                                up = '';
                            else
                                up = product.unit_price;

                            function toReais(number) {
                                if (number === '')
                                    return '---'
                                return Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(number);
                            }

                            return (
                                <li key={product.id}>
                                    <strong>PRODUTO:</strong>
                                    <p>{product.product_name}</p>
                                    <strong>DESCRIÇÃO:</strong>
                                    <p>{product.description}</p>
                                    <strong>VALOR:</strong>
                                    <p>{toReais(product.price)} / {toReais(up)}</p>
                                    <strong>UNIDADE:</strong>
                                    <p>{product.measurement_unit} / UN</p>
                                    <button onClick={() => { handleDeleteProduct(product.id) }} type="button">
                                        <FiTrash2 size={20} color="a8a8b3" />
                                    </button>
                                    <button type="button">
                                        <FiEdit size={20} color="a8a8b3" className="editButton" />
                                    </button>
                                   
                                    <img src={url + product.picture_path} alt="Imagem produto" height="auto" />

                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    );

}