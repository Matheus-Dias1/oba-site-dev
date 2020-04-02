import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowCircleLeft, FaFileUpload } from 'react-icons/fa';

import './styles.css';

function _handleChangeEvent(val) {
    console.log('oi')
    return val;
}

var text = "KG";

export default function NewProduct() {
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
                <form>
                    <input placeholder="Nome do produto" />
                    <textarea placeholder="Descrição do produto" />
                    <div className="input-group">
                        <input placeholder="Valor"/>    
                        <input type="text" placeholder="Unidade de medida" style={{width:210}} onChange={()=>{_handleChangeEvent(text);}} defaultValue={text} /> 
                        
                    </div>
                    <input placeholder="Valor unitário (opicional)" />
                    <label for="file-upload" class="custom-file-upload">
                        <FaFileUpload size={16} color="E30016" /> Selecione uma imagem
                    </label>
                    <input id="file-upload" type="file" />


                    <button className="button" type="submit">Cadastrar</button>



                </form>
            </div>
        </div>
    );
}