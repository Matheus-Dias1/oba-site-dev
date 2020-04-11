import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';
import api from '../../services/api';


import './styles.css';


export default function NewProduct() {

    const history = useHistory();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [measurement_unit, setMeasurement_unit] = useState('');
    const [unit_price, setUnit_price] = useState('');


    useEffect(() => {
        api.get('products/edit/' + window.location.pathname.split("/").pop()).then(response => {
            const {
                id,
                description,
                measurement_unit,
                price,
                product_name,
                unit_price
            } = response.data;

            setId(id);
            setName(product_name);
            setDescription(description);
            setPrice(price
                .toString()
                .replace('.', ',')
            );
            setMeasurement_unit(measurement_unit);
            setUnit_price(unit_price
                .toString()
                .replace('.', ',')
            );

        })
    }, []);

    async function handleEditProduct(e) {
        e.preventDefault();

        const data = {
            "product_name": name,
            "description": description,
            "price": parseFloat(price.replace('.', '').replace(',', '.')),
            "measurement_unit": measurement_unit.toUpperCase(),
            "unit_price": parseFloat(unit_price.replace('.', '').replace(',', '.')),
        };


        try {
            await api.put('products/edit/' + id,data);
            alert('Produto alterado com sucesso!');
            history.push('/panel/products');
        } catch (err) {
            alert('Erro ao alterar produto!\nTente novamente.');
        }

    }

    return (
        <div className="register-container">
            <div className="content">
                <section>
                    <h1>Edição de Produto</h1>
                    <p>Edite os dados do produto ao lado alterando os campos que desejar.</p>
                    <Link className="back-link" to="/panel/products">
                        <FaArrowCircleLeft size={16} color="E30016" />
                        Voltar para produtos
                    </Link>
                </section>
                <form onSubmit={handleEditProduct}>
                    <input
                        placeholder="Nome do produto"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        onInvalid={function (e) {
                            e.target.setCustomValidity("Preencha o nome do produto.");
                        }}
                        onInput={function (e) {
                            e.target.setCustomValidity("");
                        }}
                    />
                    <textarea
                        placeholder="Descrição do produto"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <div className="input-group">
                        <input
                            placeholder="Valor"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite o valor de venda.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Unidade de medida"
                            style={{ width: 210 }}
                            defaultValue={measurement_unit}
                            onChange={e => setMeasurement_unit(e.target.value)}
                            required
                            onInvalid={function (e) {
                                e.target.setCustomValidity("Digite a unidade de medida padrão.");
                            }}
                            onInput={function (e) {
                                e.target.setCustomValidity("");
                            }}
                        />

                    </div>
                    <input
                        placeholder="Valor unitário (opicional)"
                        value={unit_price}
                        onChange={e => setUnit_price(e.target.value)}
                    />

                    <button className="button" type="submit">Atualizar</button>



                </form>
            </div>
        </div>
    );
}