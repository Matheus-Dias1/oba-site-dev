import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaArrowCircleLeft } from 'react-icons/fa';


import './styles.css';
import api from '../../../services/api';


export default function Register() {

    const history = useHistory();
    try {
        var [userId] = localStorage.getItem('userId');
    } catch (err) {
        history.push('/');
    }
    const [amount, setAmount] = useState('');
    const [selectedId, setSelectedId] = useState('default');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [observation, setObservation] = useState('')
    const [totalValue, setTotalValue] = useState(0);
    const [productValue, setProductValue] = useState(0);
    const [products, setProducts] = useState([]);



    useEffect(() => {

        api.delete('shopping_carts', {
            headers:{
                authorization: parseInt(userId)
            }
        }).then();

        api.get('products').then(response => {
            setProducts(response.data);
        });

    }, [userId]);

    function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }


    async function handleAddToCart(e) {

        e.preventDefault();
        const data = {
            "id_product": parseInt(selectedId),
            "amount": parseFloat(amount.replace(',', '.')),
            "unit": selectedUnit,
            "observation": observation,

        };
        try{
            const res = await api.post('/shopping_carts', data, {
                headers: {
                    authorization: userId
                }
            });
            setProductValue(res.data.value);
            setTotalValue(totalValue + res.data.value);
            setAmount('');
            setObservation('');
        } catch(err){
            alert('Erro, confira os dados e tente novamente');
        }
    }

    function toNewAddress() {
        history.push('/panel/purchases/new/address');
    }

    function handleValueChange(e) {
        setAmount(e.target.value);
    }
    return (
        <div className="addToCart-container">
            <div className="content">
                <section>
                    <h1>Produtos</h1>
                    <p>Selecione os produtos e suas respectivas quantidades.</p>
                    <Link className="back-link" to="/panel/purchases">
                        <FaArrowCircleLeft size={16} color="E30016" />
                        Voltar para pedidos
                    </Link>
                </section>
                <div>
                    <form onSubmit={handleAddToCart}>
                        <div className="formCell">
                            <select id="product" className="selectProduct" defaultValue="default" onChange={e => setSelectedId(e.target.value)}>
                                <option value="default">Produto</option>
                                {
                                    products.map(product => {
                                        return (
                                            <option key={products.indexOf(product)} value={product.id}>{product.product_name}</option>
                                        )
                                    })
                                }
                            </select>
                            <input
                                className="inputAmount"
                                placeholder="Quantidade"
                                value={amount}
                                onChange={e => handleValueChange(e)}
                            />
                            {selectedId === 'default' && <select id="unit" disabled className="selectUnit" defaultValue="1" >
                                <option value="1"></option>
                            </select>}
                            {selectedId !== 'default' && <select id="unit" className="selectUnit" defaultValue="1" onChange={e => setSelectedUnit(e.target.value)}>
                                <option value="1"></option>
                                <option value={products[findWithAttr(products, "id", parseInt(selectedId))].measurement_unit}>{products[findWithAttr(products, "id", parseInt(selectedId))].measurement_unit}</option>
                                {products[findWithAttr(products, "id", parseInt(selectedId))].unit_price !== null && <option value="UN">UN</option>}
                            </select>}

                        </div>
                        <textarea
                            placeholder="Observação sobre produto"
                            value={observation}
                            onChange={e => setObservation(e.target.value)}
                        />
                        <div className="valueText">
                            <strong>{"VALOR DO ÚLTIMO ITEM: " + Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(productValue)}</strong>
                            <strong>{"VALOR TOTAL: " + Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}</strong>
                        </div>

                        <div className="buttons">
                            <button className="button" onClick={e => handleAddToCart(e)}>Adicionar Produto</button>
                            <button className="button" onClick={() => toNewAddress()}>Continuar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}