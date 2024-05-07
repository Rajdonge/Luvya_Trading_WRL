const express = require("express");
const cartRoutes = express.Router();
const cartController = require("../controllers/cartController");
const { ensureAuthenticated } = require("../middleware/auth");

cartRoutes.post(
  "/add-to-cart",
  ensureAuthenticated,
  cartController.add_to_cart
);

cartRoutes.get("/get-cart-items", ensureAuthenticated, cartController.get_cart_items);

module.exports = cartRoutes;
