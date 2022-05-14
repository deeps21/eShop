const MONGOOSE = require('mongoose');

const NUMBER = MONGOOSE.Schema.Types.Number;
const OBJECT_ID = MONGOOSE.Schema.Types.ObjectId;

const CART_SCHEMA = MONGOOSE.Schema({
    user: { type: OBJECT_ID, ref: 'User' },
    products: [{ type: OBJECT_ID, ref: 'product' }],
    totalPrice: { type: NUMBER, default: 0 }
});

const CART = MONGOOSE.model('Cart', CART_SCHEMA);

module.exports = CART;