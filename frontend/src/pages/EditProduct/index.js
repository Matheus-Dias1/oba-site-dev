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
    const [deliversToUberlandia, setDeliversToUberlandia] = useState(false);
    const [deliversToAraguari, setDeliversToAraguari] = useState(false);


    function updateAraguari(){
        if (deliversToAraguari) setDeliversToAraguari(false);
        else setDeliversToAraguari(true)
    }

    function updateUberlandia(){
        if (deliversToUberlandia) setDeliversToUberlandia(false);
        else setDeliversToUberlandia(true)
    }


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
                'folhas',
                'ofertas'
            ].includes(list[i])) {
                alert('"' + list[i] + '" não é uma categoria válida.\nAs categorias válidas são: verduras, frutas, ovos, temperos, queijos, congelados, carnes, doces, folhas');
                return 'FAIL'
            }
        }
        var res = ''

        for (i in list)
            res += list[i] + ','

        return res.substring(0, res.length - 1);;
    }

    function formatDeliversTo(){
        const uberlandia = deliversToUberlandia ? 'uberlandia,' : '';
        const araguari = deliversToAraguari ? 'araguari,' : '';

        return !(uberlandia+araguari) ? '' : (uberlandia+araguari).substring(0, (uberlandia+araguari).length - 1);

    }
    function setCheckboxes(str){
        if (str.includes('uberlandia')) setDeliversToUberlandia(true);
        if (str.includes('araguari')) setDeliversToAraguari(true);
    }

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
                    delivers_to
                } = response.data;
                setCategory(category);
                setId(id);
                setName(product_name);
                setDescription(description);
                setPrice(price
                    .toString()
                    .replace(/\./g, '*')
                    .replace(/,/g, '.')
                    .replace(/\*/g, ',')
                );
                setMeasurement_unit(measurement_unit);
                try{
                    setUnit_price(unit_price
                        .toString()
                        .replace(/\./g, '*')
                        .replace(/,/g, '.')
                        .replace(/\*/g, ',')
                    );
                }catch(err){

                }
                setCheckboxes(delivers_to);

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


    async function handleEditProduct(e) {
        e.preventDefault();

        const ctgry = formatCategory(category);
        const delivers_to = formatDeliversTo();
        if (ctgry === 'FAIL') return;
        const data = {
            "product_name": name.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' '),
            "description": description.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' '),
            "price": parseFloat(price.replace(/\./g, '').replace(/,/g, '.')),
            "measurement_unit": measurement_unit.replace(/^\s+|\s+$/g, '').replace(/  +/g, ' ').toUpperCase(),
            "unit_price": parseFloat(unit_price.replace(/\./g, '').replace(/,/g, '.')),
            "category": ctgry,
            "delivers_to": delivers_to
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

                    <button className="button" type="submit">Atualizar</button>



                </form>
            </div>
        </div>
    );
}