import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaHome, FaTags, FaClipboardCheck, FaBoxOpen, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import api from '../../services/api';

import { slide as Menu } from 'react-burger-menu';

import './styles.css';
import '../../global.css';


export default function CreateCupon() {
    const [amount, setAmount] = useState('');
    const [expiration, setExpiration] = useState('');
    const [discountType, setDiscountType] = useState('default');
    const [discount, setDiscount] = useState('');
    const [minValue, setMinValue] = useState('');
    const [cupon, setCupon] = useState('');

    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }

    async function handlecupon(e) {
        e.preventDefault();
        if (discountType === 'default')
            return alert('É necessário escolher um tipo de desconto')
        try {
            const data = {
                amount: parseInt(amount),
                expiration: parseInt(expiration),
                discount_type: discountType,
                discount: parseFloat(discount.replace(',','*').replace('.',',').replace('*','.')),
                min_value: parseFloat(minValue.replace(',','*').replace('.',',').replace('*','.')),
            };
            const res = await api.post('cupons', data, {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            })
            setCupon('CÓDIGO: ' + res.data.code);
            setAmount('');
            setExpiration('');
            setDiscount('');
            setMinValue('');
        } catch (err) {
            alert('Erro ao criar novo cupom.');
        }

    }
    return (
        <div>
            <Menu isOpen={false}>
                <h1 className="menu-text">OBA Hortifruti</h1>

                <Link className='menu-link' to="/panel" ><FaHome size={16} color="FFFFFF" />Início</Link>
                <Link className='menu-link' to="/panel/purchases"><FaClipboardCheck size={16} color="FFFFFF" />Pedidos</Link>
                <Link className='menu-link' to="/panel/products"><FaBoxOpen size={16} color="FFFFFF" />Produtos</Link>
                <Link className='menu-link' to="/panel/reports"><FaChartLine size={16} color="FFFFFF" />Relatórios</Link>
                <Link className='menu-link' to="/panel/cupon"><FaCalendarAlt size={16} color="FFFFFF" />Adicionar Horários</Link>
                <Link className='menu-link' to="/panel/cupon"><FaTags size={16} color="FFFFFF" />Criar cupom</Link>
            </Menu>
            <div className="cupon-container">
                <div className="content">
                    <section>
                        <h1>Criar Cupom</h1>
                        <p>Escolha a quantidade, validade, quantidade de desconto e valor mínimo do cupom.</p>
                    </section>
                    <div>
                        {!!cupon && <div className="cuponContainer">
                            <h1>{cupon}</h1>
                        </div>}
                        <form onSubmit={handlecupon}>

                            <div className="firstRow">
                                <input
                                    placeholder="Quantidade de usos"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    required
                                    onInvalid={function (e) {
                                        e.target.setCustomValidity("Digite a quantidade de uso do cupom");
                                    }}
                                    onInput={function (e) {
                                        e.target.setCustomValidity("");
                                    }}
                                />
                                <input
                                    placeholder="Validade (em horas)"
                                    value={expiration}
                                    onChange={e => setExpiration(e.target.value)}
                                    required
                                    onInvalid={function (e) {
                                        e.target.setCustomValidity("Digite a validade do cupom em horas");
                                    }}
                                    onInput={function (e) {
                                        e.target.setCustomValidity("");
                                    }}
                                />
                            </div>
                            <div className="secondRow">
                                <select id="discountType" defaultValue="default" onChange={e => setDiscountType(e.target.value)}>
                                    <option value='default'>Tipo</option>
                                    <option value='%'>Porcentagem</option>
                                    <option value='-'>Valor fixo</option>
                                </select>
                                <input
                                    placeholder="Desconto"
                                    value={discount}
                                    onChange={e => setDiscount(e.target.value)}
                                    required
                                    onInvalid={function (e) {
                                        e.target.setCustomValidity("Digite o valor do desconto");
                                    }}
                                    onInput={function (e) {
                                        e.target.setCustomValidity("");
                                    }}
                                />
                                <input
                                    placeholder="Valor mínimo"
                                    value={minValue}
                                    onChange={e => setMinValue(e.target.value)}
                                    required
                                    onInvalid={function (e) {
                                        e.target.setCustomValidity("Digite o valor mínimo em produtos para que o cupom seja aplicável");
                                    }}
                                    onInput={function (e) {
                                        e.target.setCustomValidity("");
                                    }}
                                />
                            </div>

                            <button className="button" type="submit">Confirmar</button>


                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}