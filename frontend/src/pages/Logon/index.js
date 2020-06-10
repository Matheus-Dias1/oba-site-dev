import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './styles.css';
import '../../global.css';
import api from '../../services/api'

import vegiesImg from '../../assets/fruits.svg';
import logoImg from '../../assets/OBA_logo.svg'

export default function Logon() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    async function handleLogin(e) {
        e.preventDefault();
        if (!email || !password || loading) return;
        setLoading(true);
        try {
            const response = await api.post('session', {
                email: email.replace(/^\s+|\s+$/g, ''),
                password
            });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('userName', response.data.name);
            setLoading(false)
            if (response.data.admin){
                history.push('panel');
            }else{
                alert('Você não tem permissão para acessar o painel')
            }
            
        } catch (err) {
            setLoading(false)
            if (err.response.status === 400)
                alert(err.response.data.error);
            else
            alert('Houve um erro no login! Confira seus dados e tente novamente.');
        }
    }

    return (
        <div className="logon-container">
            <section className="form">
                <img src={logoImg} alt="OBA Hortifruti" width="300px" height="153px" />
                <form onSubmit={handleLogin}>
                    <h1>Faça seu logon</h1>
                    <input
                        placeholder="E-mail"
                        defaultValue={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        defaultValue={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="button" disabled={loading} type="submit">Entrar</button>


                </form>
            </section>
            <img src={vegiesImg} alt="Vegies" width="500px" height="474px" />
        </div>
    );
}