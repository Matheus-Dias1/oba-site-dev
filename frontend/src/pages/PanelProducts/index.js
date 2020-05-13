import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaTags, FaBoxOpen, FaSignOutAlt, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { FiTrash2, FiEdit, FiEyeOff, FiEye } from 'react-icons/fi';


import { slide as Menu } from 'react-burger-menu';

import api from '../../services/api';

import './styles.css';
import '../../global.css';


export default function PanelProducts() {

    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }
    var [name] = localStorage.getItem('userName').split(" ");


    const [products, setProducts] = useState([]);
    const [reload, setReload] = useState(false);
    const url = 'http://localhost:3333/image/';


    useEffect(() => {

        try {
            api.get('products', {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).then(response => {
                setProducts(response.data);
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            });
        } catch (err) {
            alert('Erro ao recuperar produtos.');
        }

    }, [reload, history, accessToken]);

    async function handleDeleteProduct(id) {

        alert('Funcionalidade desativada');
        // try {
        //     await api.delete(`products/${id}`, {
        //         headers: {
        //             authorization: userId
        //         }
        //     });
        //     setProducts(products.filter(product => product.id !== id));
        // } catch (err) {
        //     alert('Erro ao deletar produto.');
        // }
    }

    async function handleAvailability(id) {
        const data = { id: id };
        try {
            await api.put('products', data, {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            }
            );
            setReload(!reload);

        } catch (err) {
            alert('Erro ao mudar visibilidade do produto!');
        }
    }

    function handleEditProduct(id) {
        history.push(`products/edit/${id}`);
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
                <Link className='menu-link' to="/panel/cupon"><FaTags size={16} color="FFFFFF" />Criar cupom</Link>

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
                            function toReais(number) {
                                return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
                            }

                            function containerStyle(available) {
                                if (!!!available) {
                                    return "notAvailable";
                                } return "";
                            }

                            return (
                                <li key={product.id} className={containerStyle(product.available)}>
                                    <strong>PRODUTO:</strong>
                                    <p>{product.product_name}</p>
                                    <strong>DESCRIÇÃO:</strong>
                                    <p>{product.description}</p>
                                    <strong>VALOR / {product.measurement_unit}:</strong>
                                    <p>{toReais(product.price)}</p>
                                    {!!product.unit_price && <>
                                        <strong>VALOR / UN:</strong>
                                        <p>{toReais(product.unit_price)}</p>
                                    </>}
                                    <button onClick={() => { handleDeleteProduct(product.id) }} type="button">
                                        <FiTrash2 size={20} color="a8a8b3" />
                                    </button>
                                    <button type="button">
                                        <FiEdit onClick={() => { handleEditProduct(product.id) }} size={20} color="a8a8b3" className="editButton" />
                                    </button>
                                    <button type="button">
                                        {!!product.available && <FiEyeOff onClick={() => { handleAvailability(product.id) }} size={20} color="a8a8b3" className="eyeButton" />}
                                        {!!!product.available && <FiEye onClick={() => { handleAvailability(product.id) }} size={20} color="a8a8b3" className="eyeButton" />}
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