const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    product_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    user: { type: Schema.Types.ObjectId, ref: "UserModel" } // Reference from User Model
});

const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel;