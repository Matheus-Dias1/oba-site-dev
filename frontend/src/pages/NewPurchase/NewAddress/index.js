import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowCircleLeft, FaMapMarkedAlt } from 'react-icons/fa';


import './styles.css';


export default function NewAddress() {

    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('')
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [coordinates, setCoordinates] = useState('');
    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }

    async function handleNewAddress(e) {

        function haversineDistance(coords) {
            const lat1 = -18.903228;
            const lon1 = -48.285291;
            const lat2 = coords[0];
            const lon2 = coords[1];
            const R = 6371e3;
            const φ1 = lat1 * Math.PI / 180;
            const φ2 = lat2 * Math.PI / 180;
            const Δφ = (lat2 - lat1) * Math.PI / 180;
            const Δλ = (lon2 - lon1) * Math.PI / 180;

            const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const d = R * c;
            return d / 1000;
        }
        e.preventDefault();
        const data = {
            street: street,
            number: number,
            complement: complement,
            neighborhood: neighborhood,
            city
        };
        const coordsList = coordinates.split(',')
        const floatList = coordsList.map(coord => {return parseFloat(coord.replace(/^\s+|\s+$/g, ''))})
        const distance = haversineDistance(floatList)
        const delivery_fee = distance <= 1 ? 5 : parseFloat(((distance-1)+5).toFixed(2))

        localStorage.setItem('deliveryFee', delivery_fee);
        localStorage.setItem('addressData', JSON.stringify(data));
        history.push('/panel/purchases/new/clientInfo');
    }

    return (
        <div className="newAddress-container">
            <div className="content">
                <section>
                    <h1>Endereço</h1>
                    <p>Preencha os dados do endereço de entrega.</p>
                    <Link className="back-link" to="/panel/purchases">
                        <FaArrowCircleLeft size={16} color="E30016" />
                        Voltar para pedidos
                    </Link>
                </section>
                <div>
                    <form onSubmit={handleNewAddress}>

                        <input
                            placeholder="Endereço"
                            value={street}
                            onChange={e => setStreet(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite o endereço.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <input
                            placeholder="Número"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite o número do local de entrega.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <input
                            placeholder="Complemento"
                            value={complement}
                            onChange={e => setComplement(e.target.value)}
                        />
                        <input
                            placeholder="Bairro"
                            value={neighborhood}
                            onChange={e => setNeighborhood(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite o bairro.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <input
                            placeholder="Cidade"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite a cidade.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <div className="coordinatesDiv">
                            <a className="deliveryButton" href={`https://www.google.com/maps/search/?api=1&query=${street}%20${number}%2C${neighborhood}%20${city}`} target="_blank" rel="noopener noreferrer">
                                <div className="coordinatesButtonContainer" >
                                    <FaMapMarkedAlt size={25} color="white" />
                                </div>
                            </a>
                            <input
                                className="coordinates"
                                placeholder="Coordenadas"
                                value={coordinates}
                                onChange={e => setCoordinates(e.target.value)}
                                required
                                onInvalid={function (e) {
                                    e.target.setCustomValidity("Digite o valor da taxa de entrega");
                                }}
                                onInput={function (e) {
                                    e.target.setCustomValidity("");
                                }}
                            />


                        </div>


                        <button className="button" type="submit">Continuar</button>
                    </form>

                </div>
            </div>
        </div>
    );
}