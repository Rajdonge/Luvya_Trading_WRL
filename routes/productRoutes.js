const express = require("express");
const productRoutes = express.Router();

const multer = require("multer");
const path = require("path");

const product_controller = require("../controllers/productController");
const { ensureAuthenticated } = require("../middleware/auth");
const { productValidation } = require("../middleware/productValidation");

productRoutes.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/productImages"),
      function (err, success) {
        if (err) {
          throw err;
        }
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, function (error, success) {
      if (error) {
        throw error;
      }
    });
  },
});

const upload = multer({ storage: storage });

productRoutes.post(
  "/add-product",
  upload.array("images"),
  ensureAuthenticated,
  productValidation,
  product_controller.add_product
);
productRoutes.get(
  "/get-product",
  ensureAuthenticated,
  product_controller.get_products
);
productRoutes.get(
  "/myProduct",
  ensureAuthenticated,
  product_controller.get_products_by_user_id
);
productRoutes.get(
  "/search-product",
  ensureAuthenticated,
  product_controller.search_product
);

module.exports = productRoutes;
