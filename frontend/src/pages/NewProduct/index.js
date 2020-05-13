import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowCircleLeft, FaFileUpload } from 'react-icons/fa';
import api from '../../services/api';


import './styles.css';


export default function NewProduct() {

    const history = useHistory();
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
        localStorage.clear();
        history.push('/');
    }
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [measurement_unit, setMeasurement_unit] = useState('KG');
    const [unit_price, setUnit_price] = useState('');
    const [category, setCategory] = useState('');
    const [file, setFile] = useState('');
    const [deliversToUberlandia, setDeliversToUberlandia] = useState(true);
    const [deliversToAraguari, setDeliversToAraguari] = useState(true);

    function updateAraguari(){
        if (deliversToAraguari) setDeliversToAraguari(false);
        else setDeliversToAraguari(true)
    }

    function updateUberlandia(){
        if (deliversToUberlandia) setDeliversToUberlandia(false);
        else setDeliversToUberlandia(true)
    }

    function formatDeliversTo(){
        const uberlandia = deliversToUberlandia ? 'uberlandia,' : '';
        const araguari = deliversToAraguari ? 'araguari,' : '';

        return !(uberlandia+araguari) ? '' : (uberlandia+araguari).substring(0, (uberlandia+araguari).length - 1);

    }

    async function handleNewProduct(e) {
        e.preventDefault();
        const dataS = new FormData();

        const ctgry = formatCategory(category);
        const delivers_to = formatDeliversTo();
        if (ctgry === 'FAIL') return;
        const data = JSON.stringify({
            "product_name": name,
            "description": description,
            "price": parseFloat(price.replace(',', '.')),
            "measurement_unit": measurement_unit.toUpperCase(),
            "unit_price": parseFloat(unit_price.replace(',', '.')),
            "available": true,
            "category": ctgry,
            delivers_to
        });

        dataS.append('data', data);
        dataS.append('file', file);

        try {
            await api.post('products', dataS, {
                headers: {
                    authorization: 'Bearer ' + accessToken,
                }
            }).catch(err => {
                if (err.response.status === 401 || err.response.status === 403) {
                    alert('Você não tem permissão para acessar essa página');
                    history.push('/');
                } else throw err;
            });
            alert('Produto cadastrado com sucesso!');
            history.push('/panel/products');
        } catch (err) {
            alert('Erro ao cadastrar produto!\nTente novamente.');
        }

    }

    //formatCaegory('fruTAS  ,verduras')

        function formatCategory(ctgry) {
            var i;
            const list = ctgry.split(',').map(item => {
                return item.replace(/^\s+|\s+$/g, '').toLowerCase()
            });
            for (i in list) {
                if (!!list[i] && ![
                    'verduras',
                    'frutas',
                    'ovos',
                    'temperos',
                    'queijos',
                    'congelados',
                    'carnes',
                    'doces',
                    'folhas'
                ].includes(list[i])) {
                    alert('"' + list[i] + '" não é uma categoria válida.\nAs categorias válidas são: verduras, frutas, ovos, temperos, queijos, congelados, carnes, doces, folhas');
                    return 'FAIL'
                }
            }
            var res = ''

            for (i in list)
                res += list[i] + ','

            return res.substring(0, res.length - 1);
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
                    <div className="checkboxContainer">
                        <div className="checkboxGroup">
                            <input className="cityCheckbox" type="checkbox" checked={deliversToUberlandia} onChange={updateUberlandia} />
                            <p>Uberlândia</p>
                        </div>
                        <div className="checkboxGroup">
                            <input className="cityCheckbox" type="checkbox" checked={deliversToAraguari} onChange={updateAraguari} />
                            <p>Araguari</p>
                        </div>
                    </div>
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