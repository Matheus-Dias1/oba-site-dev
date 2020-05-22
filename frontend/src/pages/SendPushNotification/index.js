import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaTags, FaBoxOpen, FaChartLine, FaCalendarAlt, FaBell } from 'react-icons/fa';
import api from '../../services/api';

import { slide as Menu } from 'react-burger-menu';

import './styles.css';
import '../../global.css';


export default function SendPushNotification() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }


    async function handlePushNotification(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        if(!body) return alert('Preencha o texto da notificação');
        try {
            const res = await api.post('/push',{
                sendTo: 'all',
                title,
                body
            },{
                headers:{
                    authorization: 'Bearer ' + accessToken
                }
            }).catch(err=>{
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            });

            if (res.data.status === 'ok')
                alert('Notificações enviadas com sucesso.')
            else{
                alert('Erro ao enviar algumas notificações, consulte um administrador')
                console.log(res.data.errors);
            }
            setLoading(false);
        } catch (err) {
            alert('Erro ao enviar notificações')
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
                        <h1>Mandar Notificações</h1>
                        <p>Preencha as informações da notificação a ser enviada</p>
                    </section>
                    <div>
                        <form onSubmit={e => handlePushNotification(e)}>
                            <input
                                placeholder="Título"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                onInvalid={function (e) {
                                    e.target.setCustomValidity("Digite o título da notificação");
                                }}
                                onInput={function (e) {
                                    e.target.setCustomValidity("");
                                }}
                            />
                            <textarea
                                placeholder="Texto da notificação"
                                value={body}
                                onChange={e => setBody(e.target.value)}
                            />
                            <button className="button" type="submit" disabled={loading}>Confirmar</button>

                        </form>


                    </div>
                </div>
            </div>
        </div >
    );

}