const USER_CONTROLLER = require('../controllers/user');
const product_CONTROLLER = require('../controllers/product');
const COMMENT_CONTROLLER = require('../controllers/comment');
const CART_CONTROLLER = require('../controllers/cart');
const ERROR_CONTROLLER = require('../controllers/error');
const AUTH = require('./auth');

module.exports = (APP) => {
    APP.post('/user/register', USER_CONTROLLER.register);
    APP.post('/user/login', USER_CONTROLLER.login);
    APP.get('/user/profile/:username', AUTH.isAuth, USER_CONTROLLER.getProfile);
    APP.get('/user/purchaseHistory', AUTH.isAuth, USER_CONTROLLER.getPurchaseHistory);
    APP.post('/user/changeAvatar', AUTH.isAuth, USER_CONTROLLER.changeAvatar);
    APP.post('/user/blockComments/:userId', AUTH.isInRole('Admin'), USER_CONTROLLER.blockComments);
    APP.post('/user/unlockComments/:userId', AUTH.isInRole('Admin'), USER_CONTROLLER.unblockComments);

    APP.get('/cart/getSize', AUTH.isAuth, CART_CONTROLLER.getCartSize);
    APP.get('/user/cart', AUTH.isAuth, CART_CONTROLLER.getCart);
    APP.post('/user/cart/add/:productId', AUTH.isAuth, CART_CONTROLLER.addToCart);
    APP.delete('/user/cart/delete/:productId', AUTH.isAuth, CART_CONTROLLER.removeFromCart);
    APP.post('/user/cart/checkout', AUTH.isAuth, CART_CONTROLLER.checkout);

    APP.get('/product/search', product_CONTROLLER.search);
    APP.get('/product/details/:productId', product_CONTROLLER.getSingle);
    APP.post('/product/add', AUTH.isInRole('Admin'), product_CONTROLLER.add);
    APP.put('/product/edit/:productId', AUTH.isInRole('Admin'), product_CONTROLLER.edit);
    APP.delete('/product/delete/:productId', AUTH.isInRole('Admin'), product_CONTROLLER.delete);
    APP.post('/product/rate/:productId', AUTH.isAuth, product_CONTROLLER.rate);
    APP.post('/product/addToFavorites/:productId', AUTH.isAuth, product_CONTROLLER.addToFavorites);

    APP.get('/comment/getLatestFiveByUser/:userId', AUTH.isAuth, COMMENT_CONTROLLER.getLatestFiveByUser);
    APP.get('/comment/:productId/:skipCount', COMMENT_CONTROLLER.getComments);
    APP.post('/comment/add/:productId', AUTH.isAuth, COMMENT_CONTROLLER.add);
    APP.put('/comment/edit/:commentId', AUTH.isAuth, COMMENT_CONTROLLER.edit);
    APP.delete('/comment/delete/:commentId', AUTH.isAuth, COMMENT_CONTROLLER.delete);

    APP.all('*', ERROR_CONTROLLER.error);
};