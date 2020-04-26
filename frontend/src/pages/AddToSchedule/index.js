import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaBoxOpen, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import api from '../../services/api';

import { slide as Menu } from 'react-burger-menu';

import './styles.css';
import '../../global.css';


export default function AddToSchedule() {
    const [errorText, setErrorText] = useState('');
    const [date, setDate] = useState('');
    const [morning_deliveries, setMorning_deliveries] = useState('');
    const [afternoon_deliveries, setAfternoon_deliveries] = useState('');

    async function handleSchedule(e) {
        e.preventDefault();
        var list = date.split('/');
        if (list.length !== 3 || date.length !== 10) {
            setErrorText('A data precisa estar no formato DD/MM/AAAA');
            return;
        }

        const data = {
            "date": list[2] + '-' + list[1] + '-' + list[0],
            "morning_deliveries": parseInt(morning_deliveries),
            "afternoon_deliveries": parseInt(afternoon_deliveries),
        };
        try {
            await api.post('/schedule', data);
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
            </Menu>
            <div className="schedule-container">
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
                            </div>
                            <button className="button" type="submit">Confirmar</button>


                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}