const CartModel = require("../models/CartModel");
const Cart = require("../models/CartModel");
const UserModel = require("../models/UserModel");
const jwt = require('jsonwebtoken');

//add to cart
const add_to_cart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart_obj = new Cart({
      product_id: req.body.product_id,
      name: req.body.name,
      price: req.body.price,
      user: userId
    });
    const cart_data = await cart_obj.save();
    return res
      .status(200)
      .send({ success: true, msg: "Cart product detail: ", data: cart_data });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
};

// Get cart items added by the user
const get_cart_items = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find the cart items associated with the user
    const cartItems = await CartModel.find({ user: userId });

    return res.status(200).send({ success: true, msg: "Cart items found", data: cartItems });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  add_to_cart,
  get_cart_items
};
