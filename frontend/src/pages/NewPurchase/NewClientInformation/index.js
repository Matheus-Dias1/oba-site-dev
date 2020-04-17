import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';


import './styles.css';
import api from '../../../services/api';


export default function NewClientInformation() {

    const history = useHistory();
    try {
        var [userId] = localStorage.getItem('userId');
    } catch (err) {
        history.push('/');
    }
    const [selectedDate, setSelectedDate] = useState('default');
    const [selectedTime, setSelectedTime] = useState('default');
    const [dateTime, setDateTime] = useState([]);
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [observation, setObservation] = useState('')



    useEffect(() => {
        api.get('schedule').then(response => {
            setDateTime(response.data);
        });

    }, [userId]);

    function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }


    async function handleClientInfo(e) {
        e.preventDefault();

        if (selectedDate === 'default' || selectedTime === 'default'){
            alert('Escolha um horário válido.');
            return;
        }
        const data = {
            clientName,
            clientPhone,
            selectedDate,
            selectedTime,
            observation
        };

        console.log(data);
        localStorage.setItem('clientInfoData', JSON.stringify(data));
        history.push('/panel/purchases/new/payment');
    
    }

    return (
        <div className="newClientInfo-container">
            <div className="content">
                <section>
                    <h1>Dados adicionais</h1>
                    <p>Alguns dados adicionais sobre o cliente e sobre a entrega.</p>
                    <Link className="back-link" to="/panel/purchases">
                        <FaArrowCircleLeft size={16} color="E30016" />
                        Voltar para pedidos
                    </Link>
                </section>
                <div>
                    <form onSubmit={handleClientInfo}>
                        <input
                            placeholder="Nome do cliente"
                            value={clientName}
                            onChange={e => setClientName(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite o nome do cliente");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <input
                            placeholder="Telefone do cliente"
                            value={clientPhone}
                            onChange={e => setClientPhone(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite o telefone de contato do cliente");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <div className="formCell">
                            <select id="selectedDate" defaultValue="default" onChange={e => setSelectedDate(e.target.value)}>
                                <option value="default">Data</option>
                                {
                                    dateTime.map(date => {
                                        return (
                                            <option key={dateTime.indexOf(date)} value={date.date}>{Intl.DateTimeFormat('pt-BR').format(new Date(date.date))}</option>
                                        )
                                    })
                                }
                            </select>

                            {selectedDate === 'default' && <select id="selectedTime" disabled className="disabled" defaultValue="default" >
                                <option value="default">Horário</option>
                            </select>}
                            {selectedDate !== 'default' && <select id="unit" defaultValue="default" onChange={e => setSelectedTime(e.target.value)}>
                                <option value="default">Horário</option>
                                {
                                    dateTime[findWithAttr(dateTime, "date", selectedDate)].times.map(time => {
                                        
                                        function formatTime(time){
                                            const list = time.split(':');
                                            return list[0] + ':' + list[1];
                                        }
                                       
                                        return (
                                            <option
                                                key={dateTime[findWithAttr(dateTime, "date", selectedDate)].times.indexOf(time)}
                                                value={time}>
                                                {formatTime(time)}
                                            </option>
                                        )
                                    })
                                }
                            </select>}

                        </div>
                        <textarea
                            placeholder="Observações sobre a entrega"
                            value={observation}
                            onChange={e => setObservation(e.target.value)}
                        />

                        <div className="buttons">
                            <button className="button" type="submit">Continuar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}