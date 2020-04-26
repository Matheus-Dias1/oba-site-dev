const express = require('express');
const multer = require('multer');
const multerConfig = require('./config/multer');
const UserController = require('./controllers/UserController');
const AddressController = require('./controllers/AddressController');
const ProductController = require('./controllers/ProductController');
const ProductUpdateController = require('./controllers/ProductUpdateController');
const PurchaseController = require('./controllers/PurchaseController');
const ShoppingCartController = require('./controllers/ShoppingCartController');
const ProductPurchaseController = require('./controllers/ProductPurchaseController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');
const ScheduleController = require('./controllers/ScheduleController');
const AuthTokenController = require('./controllers/AuthTokenController');



const routes = express.Router();

routes.get('/users', AuthTokenController.authenticateToken, UserController.index);
routes.post('/users', UserController.create);

routes.get('/addresses', AuthTokenController.authenticateToken, AddressController.index);
routes.post('/addresses', AuthTokenController.authenticateToken, AddressController.create);

routes.get('/products', AuthTokenController.authenticateToken, ProductController.index);
routes.post('/products', [AuthTokenController.authenticateToken,multer(multerConfig).single('file')], ProductController.create);
routes.put('/products', AuthTokenController.authenticateToken, ProductController.updateAvailability);

routes.get('/products/details/:id', AuthTokenController.authenticateToken, ProductUpdateController.getData);
routes.put('/products/edit/:id', AuthTokenController.authenticateToken, ProductUpdateController.update);

routes.get('/purchases', AuthTokenController.authenticateToken, PurchaseController.index);
routes.post('/purchases', AuthTokenController.authenticateToken, PurchaseController.create);
routes.put('/purchases/delivery', AuthTokenController.authenticateToken, PurchaseController.updateDelivery);

routes.post('/shopping_carts', AuthTokenController.authenticateToken, ShoppingCartController.create);
routes.delete('/shopping_carts', AuthTokenController.authenticateToken, ShoppingCartController.delete);


routes.get('/profile/addresses', AuthTokenController.authenticateToken, ProfileController.indexAddresses);
routes.get('/profile/purchases', AuthTokenController.authenticateToken, ProfileController.indexPurchases);
routes.get('/profile/products', AuthTokenController.authenticateToken, ProfileController.indexProducts);

routes.get('/productsPurchases/:idP', AuthTokenController.authenticateToken, ProductPurchaseController.index);

routes.post('/session', SessionController.create);

routes.get('/schedule', AuthTokenController.authenticateToken, ScheduleController.index);
routes.post('/schedule', AuthTokenController.authenticateToken, ScheduleController.create);

routes.get('/image/:file(*)', (req, res) => {
    try {
        let file = req.params.file;
        let fileLocation = __dirname + '/assets/' + file;
        res.sendFile(`${fileLocation}`)
    } catch(err){
        res.status(422).send();
    }
})

module.exports = routes;