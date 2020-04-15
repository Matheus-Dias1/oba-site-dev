import {BrowserRouter, Route, Switch} from 'react-router-dom';
import React from 'react';

import Logon from './pages/Logon/';
import Register from './pages/Register';
import Panel from './pages/Panel';
import PanelProducts from './pages/PanelProducts';
import PanelPurchases from './pages/PanelPurchases';
import NewProduct from './pages/NewProduct';
import EditProduct from './pages/EditProduct';
import ViewPurchase from './pages/ViewPurchase';
import PrintPurchases from './pages/PrintPurchases';





export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component = {Logon} />
                <Route path='/register' component = {Register} />
                <Route path='/panel' exact component = {Panel} />  
                <Route path='/panel/products' exact component = {PanelProducts} />  
                <Route path='/panel/products/new' component = {NewProduct} />  
                <Route path='/panel/products/edit' component = {EditProduct} />  
                <Route path='/panel/purchases' exact component = {PanelPurchases} />  
                <Route path= '/panel/purchases/view' component={ViewPurchase} />
                <Route path= '/panel/purchases/print' component={PrintPurchases} />


            </Switch>
        </BrowserRouter>
    );
}