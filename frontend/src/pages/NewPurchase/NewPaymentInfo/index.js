import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';


import './styles.css';
import api from '../../../services/api';
import { useEffect } from 'react';


export default function NewPaymentInfo() {

    const cartValue = parseFloat(localStorage.getItem('cartValue'));
    const [deliveryFee, setDeliveryFee] = useState('');
    const [totalValue, setTotalValue] = useState(cartValue + deliveryFee);
    const [change, setChange] = useState('');
    const [payment_method, setPayment_method] = useState('default');
    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }

    useEffect(() => {
        setDeliveryFee(getDeliveryFee());
    }, [])

    function getDeliveryFee() {
        try {
            return localStorage.getItem('deliveryFee').replace(',','*').replace('.',',').replace('*','.');
        } catch{
            return 10;
        }
    }

    function changeFee(e){
        const fee = e.target.value === '' ? 0 : parseFloat((e.target.value).replace(',','*').replace('.',',').replace('*','.'));
        setDeliveryFee(e.target.value);
        setTotalValue(cartValue + fee);
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
            "city": addData.city,
            "zip_code": addData.zip_code,
        };

        const date = cliData.selectedDate;
        const time = cliData.selectedTime;

        if (change !== '' && totalValue > parseFloat(change.replace(',', '.'))) {
            alert('"Troco para" deve conter um valor maior que o valor total do pedido.')
            return;
        }
        const data = {
            value: totalValue,
            payment_method: payment_method,
            change: ((change === '') ? 0 : parseFloat((parseFloat(change.replace(',', '.')) - totalValue).toFixed(2))),
            id_address: 0,
            observation: JSON.stringify(observation),
            delivery_date: date,
            delivery_period: time,
            cupon: 'NO_CUPON',
            pcity: (JSON.parse(localStorage.getItem('addressData'))).city
        };


        try {
            const res = await api.post('/purchases', data, {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            })
            if (res.data.status === 'OK') {
                localStorage.removeItem('addressData');
                localStorage.removeItem('clientInfoData');
                localStorage.removeItem('cartValue');
                history.push('/panel/purchases');
            }
            else
                alert(res.data.error);
        } catch (err) {
            alert('Erro ao concluir a compra.');
        }

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
                    <div className="deliveryFeeContainer">
                        <strong className="valueText">{"Taxa de entrega: "}</strong>
                        <input
                            placeholder="Taxa"
                            value={deliveryFee}
                            onChange={e => changeFee(e)}
                            className="deliveryFeeInput"
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite o valor da taxa de entrega");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                    </div>
                    <strong className="valueText">{"Total dos produtos: " + Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartValue)}</strong>
                    <strong className="valueText">{"Total do pedido: " + Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</strong>
                    <form onSubmit={handlePaymentInfo}>
                        <select id="payment_method" defaultValue="default" onChange={e => setPayment_method(e.target.value)}>
                            <option value="default">Método de pagamento</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="cartao">Cartão</option>
                            <option value="deposito">Depósito bancário</option>
                            <option value="ticket">Ticket</option>
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