const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyProductSchema = new Schema({
    product_id: {
        type: String,
        required: true
    },
    transaction_id: {
        type: String,
        required: true
    },
    customer_id: {
        type: String,
        required: true
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    user: { type: Schema.Types.ObjectId, ref: "UserModel" } // Reference from User Model
})

const BuyProductModel = mongoose.model("Order", buyProductSchema);
module.exports = BuyProductModel;