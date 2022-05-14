const CART = require('mongoose').model('Cart');
const product = require('mongoose').model('product');
const RECEIPT = require('mongoose').model('Receipt');
const USER = require('mongoose').model('User');

module.exports = {
    getCartSize: (req, res) => {
        let userId = req.user.id;
        CART.findOne({ user: userId }).then((cart) => {
            res.status(200).json({
                message: '',
                data: cart.products.length
            });
        });
    },

    getCart: (req, res) => {
        let userId = req.user.id;

        CART.findOne({ user: userId })
            .populate('products')
            .then((cart) => {
                res.status(200).json({
                    message: '',
                    data: cart
                });
            });
    },

    addToCart: (req, res) => {
        let userId = req.user.id;
        let productId = req.params.productId;

        product.findById(productId).then((product) => {
            if (!product) {
                return res.status(400).json({
                    message: 'There is no product with the given id in our database.'
                });
            }

            CART.findOne({ user: userId }).then((cart) => {
                let productIds = [];

                for (let b of cart.products) {
                    productIds.push(b.toString());
                }

                if (productIds.indexOf(productId) !== -1) {
                    return res.status(400).json({
                        message: 'Product is already in your cart'
                    });
                }

                cart.products.push(productId);
                cart.totalPrice += product.price;
                cart.save();

                res.status(200).json({
                    message: 'Product added to cart!',
                    data: cart
                });
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
    },

    removeFromCart: (req, res) => {
        let userId = req.user.id;
        let productId = req.params.productId;

        product.findById(productId).then((product) => {
            if (!product) {
                return res.status(400).json({
                    message: 'There is no product with the given id in our database.'
                });
            }

            CART.findOne({ user: userId }).then((cart) => {
                cart.products = cart.products
                    .map(b => b.toString())
                    .filter(b => b !== productId);
                cart.totalPrice -= product.price;
                cart.save();

                res.status(200).json({
                    message: 'Product removed from cart!',
                    data: cart
                });
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
    },

    checkout: (req, res) => {
        let userId = req.user.id;
        let totalPrice = 0;
        let products = [];

        CART
            .findOne({ user: userId })
            .populate('products')
            .then((cart) => {
                for (let product of cart.products) {
                    totalPrice += product.price * req.body[product._id.toString()];
                    products.push({
                        id: product._id,
                        title: product.title,
                        author: product.author,
                        cover: product.cover,
                        price: product.price,
                        qty: req.body[product._id.toString()]
                    });
                }

                RECEIPT.create({
                    user: userId,
                    productsInfo: products,
                    totalPrice: totalPrice
                }).then((receipt) => {
                    USER.update({ _id: userId }, { $push: { receipts: receipt._id } }).then(() => {
                        cart.products = [];
                        cart.totalPrice = 0;
                        cart.save();
                        return res.status(200).json({
                            message: 'Thank you for your order! Your product will be sent to you as soon as possible!',
                            data: receipt
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                    return res.status(400).json({
                        message: 'Something went wrong, please try again.'
                    });
                });
            });
    }
};