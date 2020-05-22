import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaTags, FaBoxOpen, FaChartLine, FaCalendarAlt, FaBell } from 'react-icons/fa';
import api from '../../services/api';

import { slide as Menu } from 'react-burger-menu';

import './styles.css';
import '../../global.css';


export default function SendPushNotification() {
    const [errorText, setErrorText] = useState('');
    const [date, setDate] = useState('');
    const [morning_deliveries, setMorning_deliveries] = useState('');
    const [afternoon_deliveries, setAfternoon_deliveries] = useState('');
    const [city, setCity] = useState('');
    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }


    async function handleSchedule(e) {
        e.preventDefault();
        const list = date.split('/');
        if (list.length !== 3) {
            setErrorText('A data precisa estar no formato DD/MM/AAAA');
            return;
        }

        let year = list[2];
        if (list[2].length === 2) {
            year = '20' + list[2];
        }

        const date2 = Date.UTC(parseInt(year), parseInt(list[1]) - 1, parseInt(list[0]), 3, 0, 0);
        console.log(date2);
        const data = {
            "date": date2,
            "morning_deliveries": parseInt(morning_deliveries),
            "afternoon_deliveries": parseInt(afternoon_deliveries),
            "city": city
        };
        try {
            await api.post('/schedule', data, {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            });
            setMorning_deliveries('');
            setAfternoon_deliveries('');
            setDate('');
            setErrorText('');
        } catch (err) {
            alert('Erro ao cadastrar horário!');
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
                <Link className='menu-link' to="/panel/schedule"><FaCalendarAlt size={16} color="FFFFFF" />Adicionar Horários</Link>
                <Link className='menu-link' to="/panel/cupon"><FaTags size={16} color="FFFFFF" />Criar cupom</Link>
                <Link className='menu-link' to="/panel/push"><FaBell size={16} color="FFFFFF" />Enviar notificações</Link>

            </Menu>
            <div className="sendPush-container">
                <div className="content">
                    <section>
                        <h1>Adicionar Horários</h1>
                        <p>Escolha a data e quantas entregas terão em cada período</p>
                    </section>
                    <div>
                        {errorText !== '' && <p className="errorText">{errorText}</p>}
                        <form onSubmit={handleSchedule}>

                            <input
                                placeholder="DD/MM/AAAA"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                required
                                onInvalid={function (e) {
                                    e.target.setCustomValidity("Digite a data");
                                }}
                                onInput={function (e) {
                                    e.target.setCustomValidity("");
                                }}
                            />
                            <div className="periodAmout">
                                <input
                                    placeholder="Quantidade de entregas na manhã"
                                    value={morning_deliveries}
                                    onChange={e => setMorning_deliveries(e.target.value)}
                                    required
                                    onInvalid={function (e) {
                                        e.target.setCustomValidity("Digite a quantidade de entregas na manhã");
                                    }}
                                    onInput={function (e) {
                                        e.target.setCustomValidity("");
                                    }}
                                />
                                <input
                                    placeholder="Quantidade de entregas na tarde"
                                    value={afternoon_deliveries}
                                    onChange={e => setAfternoon_deliveries(e.target.value)}
                                    required
                                    onInvalid={function (e) {
                                        e.target.setCustomValidity("Digite a quantidade de entregas na manhã");
                                    }}
                                    onInput={function (e) {
                                        e.target.setCustomValidity("");
                                    }}
                                />
                                <div className="radioInputGroup">
                                    <div>
                                        <input
                                            className="radioInput"
                                            type="radio"
                                            id="uberlandia"
                                            name="city"
                                            value=""
                                            onClick={() => setCity('uberlandia')}
                                        />
                                        <label for="uberlandia">Uberlândia</label>
                                    </div>
                                    <div>
                                        <input
                                            className="radioInput"
                                            type="radio"
                                            id="aragarui"
                                            name="city"
                                            value=""
                                            onClick={() => setCity('araguari')}
                                        />
                                        <label for="aragarui">Araguari</label>
                                    </div>
                                </div>
                            </div>
                            <button className="button" type="submit">Confirmar</button>


                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}