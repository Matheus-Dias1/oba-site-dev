import React from 'react';
import {Link} from 'react-router-dom';
import {FaArrowCircleLeft} from 'react-icons/fa'

import './styles.css';

import logoImg from '../../assets/OBA_logo.svg'

export default function Register(){
    return(
        <div className="register-container">
            <div className="content">
                <section>
                   <img src={logoImg} alt="OBA Hortifruti" width="200px" height="102px"/>
                    <h1>Cadastro</h1>
                    <p>Faça seu cadastro, entre na plataforma e comece a comprar hortifruti!</p>
                    <Link className="back-link" to="/logon">
                        <FaArrowCircleLeft size={16} color="E30016"/>
                        Voltar para logon
                    </Link>
                </section>
                <form>
                    <input placeholder="Nome completo" />
                    <input type="email" placeholder="E-mail" />
                    <input placeholder="Telefone" />
                    <input type="password" placeholder="Senha"/>
                    <input type="password" placeholder="Confirmar senha"/>
                    <button className="button" type="submit">Cadastrar</button>


                </form>
            </div>
        </div>
    );
}