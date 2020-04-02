import React from 'react';
import {Link} from 'react-router-dom';
import {FaUserPlus} from 'react-icons/fa'
import './styles.css';
import '../../global.css';


import vegiesImg from '../../assets/fruits.svg';
import logoImg from '../../assets/OBA_logo.svg'

export default function Logon(){
    return (
        <div className="logon-container">
            <section className="form">
                <img src={logoImg} alt="OBA Hortifruti" width="300px" height="153px"/>
                <form>
                    <h1>Faça seu logon</h1>
                    <input placeholder="E-mail"/>
                    <input type="password" placeholder="Senha"/>
                    <button className="button" type="submit">Entrar</button>
                    <Link className="back-link" to="/register">
                        <FaUserPlus size={16} color="E30016"/>
                        Não tenho cadastro
                    </Link>

                </form>
            </section>
            <img src={vegiesImg} alt="Vegies" width="500px" height="474px"/>
        </div>
    );
}