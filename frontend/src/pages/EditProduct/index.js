import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';
import api from '../../services/api';


import './styles.css';


export default function EditProduct() {

    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [measurement_unit, setMeasurement_unit] = useState('');
    const [unit_price, setUnit_price] = useState('');
    const [category, setCategory] = useState('');


    useEffect(() => {
        try {
            api.get('products/details/' + window.location.pathname.split("/").pop(), {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).then(response => {
                const {
                    id,
                    description,
                    measurement_unit,
                    price,
                    product_name,
                    unit_price,
                    category,
                } = response.data;

                setCategory(category);
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

            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            })
        }catch(err){
            alert('Erro ao recuperar as informações do produto.');
        }
    }, [accessToken, history]);

    function formatCategory(ctgry) {
        return ctgry;
    }

    async function handleEditProduct(e) {
        e.preventDefault();

        const data = {
            "product_name": name,
            "description": description,
            "price": parseFloat(price.replace('.', '').replace(',', '.')),
            "measurement_unit": measurement_unit.toUpperCase(),
            "unit_price": parseFloat(unit_price.replace('.', '').replace(',', '.')),
            "category": formatCategory(category),
        };


        try {
            await api.put('products/edit/' + id, data, {
                headers: {
                    authorization: 'Bearer ' + accessToken
                }
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            });
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
                    <input
                        placeholder="Categoria. Ex: fruta,vegetal,carne..."
                        value={category}
                        onChange={e => setCategory(e.target.value)}
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