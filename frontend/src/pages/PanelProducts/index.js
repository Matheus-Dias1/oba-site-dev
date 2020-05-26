import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaTags, FaBoxOpen, FaBell, FaSignOutAlt, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { FiPercent, FiEdit, FiEyeOff, FiEye } from 'react-icons/fi';


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

    }, [history, accessToken]);


    async function handleAvailability(id, prodIndex) {
        try {
            await api.put(`products/${id}`, {}, {
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

            let prod = products[prodIndex]
            prod.available = prod.available ? 0 : 1

            const firstHalf = products.slice(0, prodIndex)
            const secondHalf = products.slice(prodIndex + 1, products.length)



            if (prod.available)
                setProducts([prod, ...firstHalf, ...secondHalf])
            else
                setProducts([...firstHalf, ...secondHalf, prod])


        } catch (err) {
            alert('Erro ao mudar visibilidade do produto!');
        }
    }

    async function handleDealCreate(index) {
        try {
            const dealPrice = parseFloat(prompt(`Digite o preço do(a) ${products[index].measurement_unit} com desconto`).replace(/\./g, '*').replace(/,/g, '.').replace(/\*/g, ','));
            const dealUnitPrice = products[index].unit_price ? parseFloat(prompt('Digite o valor da UN com desconto').replace(/\./g, '*').replace(/,/g, '.').replace(/\*/g, ',')) : null;
            if (!dealPrice && !dealUnitPrice) return;
            await api.put(`products/deal/create/${products[index].id}`, {
                dealUnitPrice: dealUnitPrice ? dealUnitPrice : null,
                unitPrice: products[index].unit_price,
                dealPrice: dealPrice ? dealPrice : null,
                price: products[index].price,
                category: products[index].category
            }, {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            })
            let prods = products;
            const curPrice = products[index].price;
            const curUnitPrice = products[index].unit_price;
            prods[index].price = dealPrice ? dealPrice : prods[index].price
            prods[index].unit_price = dealUnitPrice ? dealUnitPrice : prods[index].unit_price
            prods[index].full_price = dealPrice ? curPrice : null
            prods[index].full_unit_price = dealUnitPrice ? curUnitPrice : null
            setProducts([])
            setProducts(prods)

        } catch (err) {
            alert('Erro ao criar oferta');
        }
    }

    async function handleDealRemove(index) {
        try {
            await api.put(`products/deal/remove/${products[index].id}`, {
                unitPrice: products[index].full_unit_price ? products[index].full_unit_price : products[index].unit_price,
                price: products[index].full_price ? products[index].full_price : products[index].price,
                category: products[index].category
            }, {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            })
            let prods = products;
            prods[index].price = products[index].full_price ? products[index].full_price : products[index].price
            prods[index].unit_price = products[index].full_unit_price ? products[index].full_unit_price : products[index].unit_price
            prods[index].full_price = null
            prods[index].full_unit_price = null
            setProducts([])
            setProducts(prods)

        } catch (err) {
            alert('Erro ao remover oferta');
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
                <Link className='menu-link' to="/panel/push"><FaBell size={16} color="FFFFFF" />Enviar notificações</Link>

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
                                    {!(product.full_price || product.full_unit_price) && <button onClick={() => { handleDealCreate(products.indexOf(product)) }} type="button">
                                        <FiPercent size={20} color="a8a8b3" />
                                    </button>}
                                    {(product.full_price || product.full_unit_price) && <button onClick={() => { handleDealRemove(products.indexOf(product)) }} type="button">
                                        <FiPercent size={20} color="f56138" />
                                    </button>}
                                    
                                    <button type="button">
                                        <FiEdit onClick={() => { handleEditProduct(product.id) }} size={20} color="a8a8b3" className="editButton" />
                                    </button>
                                    <button type="button">
                                        {!!product.available && <FiEyeOff onClick={() => { handleAvailability(product.id, products.indexOf(product)) }} size={20} color="a8a8b3" className="eyeButton" />}
                                        {!!!product.available && <FiEye onClick={() => { handleAvailability(product.id, products.indexOf(product)) }} size={20} color="a8a8b3" className="eyeButton" />}
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