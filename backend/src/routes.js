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
const GeocodeAPI = require('./controllers/GeocodeAPI');
const CuponController = require('./controllers/CuponController');
const ProfileUpdateController = require('./controllers/ProfileUpdateController');
const PasswordResetController = require('./controllers/PasswordResetController');
const DBController = require('./controllers/DBController');
const PushNotificationController = require('./controllers/PushNotificationController');
const FacebookPixelController = require('./controllers/FacebookPixelController');

const routes = express.Router();

routes.get('/users', AuthTokenController.authenticateToken, UserController.index);
routes.post('/users', UserController.create);

routes.get('/addresses', AuthTokenController.authenticateToken, AddressController.index);
routes.post('/addresses', AuthTokenController.authenticateToken, AddressController.create);

routes.get('/products', AuthTokenController.authenticateToken, ProductController.index);
routes.post('/products', [AuthTokenController.authenticateToken, multer(multerConfig).single('file')], ProductController.create);
routes.put('/products/:id', AuthTokenController.authenticateToken, ProductController.updateAvailability);

routes.get('/products/details/:id', AuthTokenController.authenticateToken, ProductUpdateController.getData);
routes.put('/products/edit/:id', AuthTokenController.authenticateToken, ProductUpdateController.update);
routes.put('/products/deal/create/:id', AuthTokenController.authenticateToken, ProductUpdateController.createDeal);
routes.put('/products/deal/remove/:id', AuthTokenController.authenticateToken, ProductUpdateController.removeDeal);

routes.get('/purchases', AuthTokenController.authenticateToken, PurchaseController.index);
routes.post('/purchases', AuthTokenController.authenticateToken, PurchaseController.create);
routes.put('/purchases/delivery/:id', AuthTokenController.authenticateToken, PurchaseController.updateDelivery);

routes.post('/shopping_carts', AuthTokenController.authenticateToken, ShoppingCartController.create);
routes.delete('/shopping_carts', AuthTokenController.authenticateToken, ShoppingCartController.delete);
routes.get('/shopping_carts', AuthTokenController.authenticateToken, ShoppingCartController.index);
routes.get('/shopping_carts/check', AuthTokenController.authenticateToken, ShoppingCartController.checkForCity);


routes.get('/profile/addresses', AuthTokenController.authenticateToken, ProfileController.indexAddresses);
routes.get('/profile/purchases', AuthTokenController.authenticateToken, ProfileController.indexPurchases);
routes.get('/profile/products', AuthTokenController.authenticateToken, ProfileController.indexProducts);
routes.get('/profile/shopping_cart', AuthTokenController.authenticateToken, ProfileController.indexShoppingCart);
routes.delete('/profile/shopping_cart', AuthTokenController.authenticateToken, ProfileController.deleteItemFromCart);
routes.get('/profile/shopping_cart/value', AuthTokenController.authenticateToken, ProfileController.getCartTotal);
routes.get('/profile/productsPurchase/:id_purchase', AuthTokenController.authenticateToken, ProfileController.indexProductsPurchase);

routes.get('/profile/edit/', AuthTokenController.authenticateToken, ProfileUpdateController.getData);
routes.put('/profile/edit/', AuthTokenController.authenticateToken, ProfileUpdateController.update);
routes.put('/profile/edit/password', AuthTokenController.authenticateToken, ProfileUpdateController.updatePassword);

routes.get('/productsPurchases/:idP', AuthTokenController.authenticateToken, ProductPurchaseController.index);

routes.post('/session', SessionController.create);

routes.post('/cupons', AuthTokenController.authenticateToken, CuponController.create);
routes.get('/cupons/:code', AuthTokenController.authenticateToken, CuponController.getCupon);

routes.put('/profile/addresses/hide/:id', AuthTokenController.authenticateToken, ProfileController.hideAddress);

routes.get('/schedule', AuthTokenController.authenticateToken, ScheduleController.index);
routes.post('/schedule', AuthTokenController.authenticateToken, ScheduleController.create);

routes.get('/geocoding', AuthTokenController.authenticateToken, GeocodeAPI.getAddress);
routes.get('/geocoding/reverse', AuthTokenController.authenticateToken, GeocodeAPI.getCoordinates);

routes.post('/recoverPassword', PasswordResetController.recoverPassword);

routes.post('/dbquery', AuthTokenController.authenticateToken, DBController.dbQuery);

routes.put('/push', AuthTokenController.authenticateToken, PushNotificationController.updateExpoToken);
routes.post('/push', AuthTokenController.authenticateToken, PushNotificationController.sendPush);
routes.post('/fbPixel/register', FacebookPixelController.CompleteRegistration);
routes.post('/fbPixel/checkout/initiate', AuthTokenController.authenticateToken, FacebookPixelController.InitiateCheckout);
routes.post('/fbPixel/checkout/finalize', AuthTokenController.authenticateToken, FacebookPixelController.FinalizeCheckout);
routes.post('/fbPixel/contact', AuthTokenController.authenticateToken, FacebookPixelController.Contact);


routes.get('/image/:file(*)', (req, res) => {
    try {
        let file = req.params.file;
        if (file !== 'undefined') {
            let fileLocation = __dirname + '/assets/' + file;
            res.sendFile(`${fileLocation}`)
        }
    } catch (err) {
        res.status(422).send();
    }
})

module.exports = routes;