const express = require('express');
const multer = require('multer');
const UserController = require('./controllers/UserController');
const AddressController = require('./controllers/AddressController');
const ProductController = require('./controllers/ProductController');
const PurchaseController = require('./controllers/PurchaseController');
const ShoppingCartController = require('./controllers/ShoppingCartController');
const ProductPurchaseController = require('./controllers/ProductPurchaseController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');


const routes = express.Router();

routes.get('/users', UserController.index);
routes.post('/users', UserController.create);

routes.get('/addresses', AddressController.index);
routes.post('/addresses', AddressController.create);
routes.delete('/addresses/:id', AddressController.delete);


routes.get('/products', ProductController.index);
routes.post('/products', multer().single('file'),ProductController.create);
routes.delete('/products/:id', ProductController.delete);


routes.get('/purchases', PurchaseController.index);
routes.post('/purchases', PurchaseController.create);

routes.get('/shopping_carts', ShoppingCartController.index);
routes.post('/shopping_carts', ShoppingCartController.create);

routes.get('/profile/addresses', ProfileController.indexAddresses);
routes.get('/profile/purchases', ProfileController.indexPurchases);
routes.get('/profile/shopping_cart', ProfileController.indexShoppingCarts);


routes.get('/productsPurchases', ProductPurchaseController.index);

routes.post('/session', SessionController.create);

module.exports = routes;