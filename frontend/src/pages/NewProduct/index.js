import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowCircleLeft, FaFileUpload } from 'react-icons/fa';
import api from '../../services/api';


import './styles.css';



export default function NewProduct() {


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [measurement_unit, setMeasurement_unit] = useState('KG');
    const [unit_price, setUnit_price] = useState('');
    const [file, setFile] = useState('');

    async function handleNewProduct(e){
        e.preventDefault();
        const data = {
            product_name: name,
            description: description,
            price: parseFloat(price),
            measurement_unit: measurement_unit.toUpperCase(),
            unit_price: parseFloat(unit_price),
            file: file,
            available: true
        };
        console.log(data);
        await api.post('products', data);
    }

    return (
        <div className="register-container">
            <div className="content">
                <section>
                    <h1>Cadastro de Produto</h1>
                    <p>Cadastre novos produtos preenchendo as informações ao lado.</p>
                    <Link className="back-link" to="/panel/products">
                        <FaArrowCircleLeft size={16} color="E30016" />
                        Voltar para produtos
                    </Link>
                </section>
                <form onSubmit={handleNewProduct}>
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

                    <label htmlFor="file-upload" className="custom-file-upload">
                        <FaFileUpload size={16} color="E30016" /> Selecione uma imagem
                    </label>
                    <input id="file-upload" type="file" onChange={e => setFile(e.target.files[0])} />


                    <button className="button" type="submit">Cadastrar</button>



                </form>
            </div>
        </div>
    );
}