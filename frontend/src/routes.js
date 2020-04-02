import {BrowserRouter, Route, Switch} from 'react-router-dom';
import React from 'react';

import Logon from './pages/Logon/';
import Register from './pages/Register';
import Panel from './pages/Panel';
import PanelProducts from './pages/PanelProducts';
import PanelPurchases from './pages/PanelPurchases';
import NewProduct from './pages/NewProduct';


export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component = {Logon} />
                <Route path='/register' component = {Register} />
                <Route path='/panel' exact component = {Panel} />  
                <Route path='/panel/products' exact component = {PanelProducts} />  
                <Route path='/panel/purchases' component = {PanelPurchases} />  
                <Route path='/panel/products/new' component = {NewProduct} />  
            </Switch>
        </BrowserRouter>
    );
}