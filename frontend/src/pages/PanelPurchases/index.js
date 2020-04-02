import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaBoxOpen} from 'react-icons/fa';
import logoImg from '../../assets/OBA_logo.svg'


import { slide as Menu } from 'react-burger-menu';

import './styles.css';
import '../../global.css';


export default function PanelPurchases() {
    return (
        <div>
            <Menu isOpen={ true }>
                <h1 className="menu-text">OBA Hortifruti</h1>
                
                <Link className='menu-link' to="/panel" ><FaHome size={16} color="FFFFFF" />Início</Link>
                <Link className='menu-link' to="/panel/purchases"><FaClipboardCheck size={16} color="FFFFFF" />Pedidos</Link>
                <Link className='menu-link' to="/panel/products"><FaBoxOpen size={16} color="FFFFFF" />Produtos</Link>
            </Menu>
            <div className="imgLogo">
                
                <img src={logoImg} className="imgLogo" alt="OBA Hortifruti" width="550px" height="260px"/>
                
            </div>
        </div>
    );

}