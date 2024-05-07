const express = require("express");
const { ensureAuthenticated } = require("../middleware/auth");
const buyProductRoutes = express.Router();
const buy_product_controller = require("../controllers/buyProductController");

buyProductRoutes.post(
  "/buy-product",
  ensureAuthenticated,
  buy_product_controller.buy_product
);

buyProductRoutes.get(
  "/getPurchasedItems",
  ensureAuthenticated,
  buy_product_controller.get_purchased_items
);

buyProductRoutes.get(
  "/admin-check-orders",
  ensureAuthenticated,
  buy_product_controller.get_purchased_items_by_admin
);
module.exports = buyProductRoutes;
