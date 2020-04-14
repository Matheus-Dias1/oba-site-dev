import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaClipboardCheck, FaBoxOpen, FaArrowCircleLeft, FaTruck, FaChartLine, FaClipboardList } from 'react-icons/fa';
import { slide as Menu } from 'react-burger-menu';

import api from '../../services/api';

import './styles.css';
import '../../global.css';


export default function PanelPurchases() {
    const [name] = localStorage.getItem('userName').split(" ");
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        api.get('purchases').then(response => {
            setPurchases(response.data);
        });

    }, [name]);

    function handleDelivered(id) {
        const data = { id: id };
        try {
            api.put('purchases/delivery', data);
            setPurchases(purchases.filter(purchase => purchase.id !== id));
        } catch (err) {
            alert('Erro ao marcar compra como entrege.');
        }
    }

    return (
        <div className="viewPurchase-container">
            <h1>Pedido #0005</h1>
            <div className="content">
                <div className="topInfo">
                    <table>
                        <tr>
                            <td><strong>COMPRADOR:</strong></td>
                            <td><p>Matheus Dias Gama</p></td>
                        </tr>
                        <tr>
                            <td><strong>ENDEREÇO:</strong></td>
                            <td><p>Rua blablablalbla&nbsp;&nbsp;lblasfllf,sdf s</p></td>
                        </tr>
                        <tr>
                            <td><strong>ENTREGA:</strong></td>
                            <td><p>11/04/2020 - 17:00</p></td>

                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td><strong>VALOR:</strong></td>
                            <td><p>R$ 75,00</p></td>
                        </tr>
                        <tr>
                            <td><strong>PAGAMENTO:</strong></td>
                            <td><p>Dinheiro</p></td>
                        </tr>
                        <tr>
                            <td><strong>TROCO:</strong></td>
                            <td><p>R$ 25,00</p></td>
                        </tr>

                    </table>
                </div>
                <div className="bottomInfo">
                    <table>
                        <tr>
                            <td width="25%"><strong>PRODUTO</strong></td>
                            <td width="15%"><strong>QUANTIDADE</strong></td>
                            <td width="15%"><strong>MEDIDA</strong></td>
                            <td><strong>OBSERVAÇÃO</strong></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível </p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                            
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                        <tr>
                            <td><p>Maçã</p></td>
                            <td><p>50</p></td>
                            <td><p>UN</p></td>
                            <td><p>Mais verdes o possível</p></td>
                        </tr>
                    </table>
                </div>


            </div>
            <Link className="back-link" to="/panel/purchases">
                <FaArrowCircleLeft size={16} color="E30016" />
                Voltar para pedidos
            </Link>
        </div>

    );

}