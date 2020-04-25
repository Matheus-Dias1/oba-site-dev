import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';


import './styles.css';
import api from '../../../services/api';


export default function NewPaymentInfo() {

    const cartValue = parseFloat(localStorage.getItem('cartValue'));
    const deliveryPrice = valueDelivery();
    const totalValue = cartValue + deliveryPrice;
    const [change, setChange] = useState('');
    const [payment_method, setPayment_method] = useState('default');
    const history = useHistory();

    function valueDelivery() {
        //const val = localStorage.getItem('addressData');
        return 8;
    }

    async function handlePaymentInfo(e) {
        e.preventDefault();
        const addData = JSON.parse(localStorage.getItem('addressData'));
        const cliData = JSON.parse(localStorage.getItem('clientInfoData'));

        const observation = {
            "client": cliData.clientName,
            "phone": cliData.clientPhone,
            "observation": cliData.observation,
            "complement": addData.complement,
            "neighborhood": addData.neighborhood,
            "number": addData.number,
            "street": addData.street,
            "zip_code": addData.zip_code,
        };

        const date = cliData.selectedDate;
        const time = cliData.selectedTime;

        if (change !== '' && totalValue > parseFloat(change.replace(',','.'))){
            alert('"Troco para" deve conter um valor maior que o valor total do pedido.')
            return;
        }
        const data = {
            value: totalValue,
            payment_method: payment_method,
            change: ((change === '') ? 0 : parseFloat((parseFloat(change.replace(',','.'))-totalValue).toFixed(2))),
            id_address: 0,
            observation: JSON.stringify(observation),
            delivery_date: date,
            delivery_period: time
        };


        await api.post('/purchases', data, {
            headers:{
                authorization: 0
            }
        })
        localStorage.removeItem('addressData');
        localStorage.removeItem('clientInfoData');
        localStorage.removeItem('cartValue');
        history.push('/panel/purchases');

    }

    return (
        <div className="newPaymentInfo-container">
            <div className="content">
                <section>
                    <h1>Valor e pagamento</h1>
                    <p>Selecione o método de pagamento e informe caso troco seja necessário.</p>
                    <Link className="back-link" to="/panel/purchases">
                        <FaArrowCircleLeft size={16} color="E30016" />
                        Voltar para pedidos
                    </Link>
                </section>
                <div>
                    <strong className="valueText">{"Total dos produtos: " + Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartValue)}</strong>
                    <strong className="valueText">{"Taxa de entrega: " + Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deliveryPrice)}</strong>
                    <strong className="valueText">{"Total do pedido: " + Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</strong>
                    <form onSubmit={handlePaymentInfo}>
                        <select id="payment_method" defaultValue="default" onChange={e => setPayment_method(e.target.value)}>
                            <option value="default">Método de pagamento</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="cartao">Cartão</option>
                            <option value="deposito">Depósito bancário</option>
                        </select>
                        {
                            payment_method === 'dinheiro' &&
                            <input
                                placeholder="Troco para"
                                value={change}
                                onChange={e => setChange(e.target.value)}
                                className="changeInput"
                                required
                                onInvalid={function (e) {
                                    e.target.setCustomValidity("Digite o valor que será pago em dinheiro");
                                }}
                                onInput={function (e) {
                                    e.target.setCustomValidity("");
                                }}
                            />
                        }
                        <button className="button" type="submit">Finalizar</button>

                    </form>
                </div>
            </div>
        </div>
    );
}