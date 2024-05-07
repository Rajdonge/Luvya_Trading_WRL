const BuyProductModel = require("../models/BuyProductModel");
const BuyProduct = require("../models/BuyProductModel");

const buy_product = async (req, res) => {
  try {
    const userId = req.user._id;
    const buyProduct = new BuyProduct({
      product_id: req.body.product_id,
      transaction_id: req.body.transaction_id,
      customer_id: req.body.customer_id,
      user: userId
    });

    const buyProductData = await buyProduct.save();
    res
      .status(200)
      .send({
        success: true,
        msg: "Buy Product Details: ",
        data: buyProductData,
      });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

//get Purchase Item Details
const get_purchased_items = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find the cart items associated with the user
    const purchasedItems = await BuyProductModel.find({ user: userId });

    return res.status(200).send({ success: true, msg: "Purchased items found", data: purchasedItems });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
};

//Admin View of Order got by Users
const get_purchased_items_by_admin = async (req, res) => {
  try {
    // Find the cart items associated with the user
    const purchasedItems = await BuyProductModel.find();

    return res.status(200).send({ success: true, msg: "Purchased items found", data: purchasedItems });
  } catch (error) {
    return res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  buy_product,
  get_purchased_items,
  get_purchased_items_by_admin
};
