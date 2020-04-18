import React, { useState } from 'react';
import { Link, useHistory} from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';


import './styles.css';


export default function NewAddress() {

    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('')
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [zip_code, setZip_code] = useState('');
    const history = useHistory();

    async function handleNewAddress(e) {
        e.preventDefault();
        const data = {
                street: street,
                number: number,
                complement: complement,
                neighborhood: neighborhood,
                zip_code: zip_code
        };

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
                                placeholder="CEP"
                                value={zip_code}
                                onChange={e => setZip_code(e.target.value)}
                                required
                                onInvalid={function (e) {
                                    e.target.setCustomValidity("Digite o CEP");
                                }}
                                onInput={function (e) {
                                    e.target.setCustomValidity("");
                                }}
                            />
                        

                        <button className="button" type="submit">Continuar</button>
                    </form>

                </div>
            </div>
        </div>
    );
}