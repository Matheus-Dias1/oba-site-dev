import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa'
import './styles.css';
import api from '../../services/api';
import logoImg from '../../assets/OBA_logo.svg';


export default function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [errorText, setErrorText] = useState('');
    
    const history = useHistory();

    async function handleRegister(e) {
        e.preventDefault();

        if (password.length < 4) {
            setErrorText('Sua senha deve ter ao menos 4 dígitos.');
            return;
        }

        if (password === cPassword) {
            const data = {
                name,
                email,
                password,
                phone,
            };
            try {
                const response = await api.post('users', data);
                if (response.data.status === 'success') {
                    alert("Usuário cadastrado com sucesso.");
                    history.push('/')
                }
                else if (response.data.status === 'fail') {
                    setErrorText(response.data.error);
                }
            } catch (e) {
                console.log(e);
                setErrorText('Erro no cadastro, confira seus dados!');
            }

        }
        else {
            setErrorText('As senhas não são identicas!');
        }


    }


    return (
        <div className="register-container">
            <div className="content">
                <section>
                    <img src={logoImg} alt="OBA Hortifruti" width="200px" height="102px" />
                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro, entre na plataforma e comece a comprar hortifruti!</p>
                    <Link className="back-link" to="/">
                        <FaArrowCircleLeft size={16} color="E30016" />
                        Voltar para logon
                    </Link>
                </section>
                <div className="errorText">
                    <p>{errorText}</p>
                    <form onSubmit={handleRegister}>
                        <input
                            placeholder="Nome completo"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Preencha seu nome completo.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite um e-mail válido.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <input
                            placeholder="Telefone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite seu telefone de contato.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}

                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite sua senha.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Confirmar senha"
                            value={cPassword}
                            onChange={e => setCPassword(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digita sua senha novamente.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <button className="button" type="submit">Cadastrar</button>


                    </form>
                </div>
            </div>
        </div>
    );
}