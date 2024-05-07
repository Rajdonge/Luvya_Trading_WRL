const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: Array,
    required: true,
    validate: [
      arrayLimit,
      "You should upload at least one image and can upload only 5 images.",
    ],
  },
  user: { type: Schema.Types.ObjectId, ref: "UserModel" } // Reference from User Model
});

function arrayLimit(val) {
  if (val.length === 0) {
    return false;
  }
  if (val.length > 5) {
    return false;
  }
  return true;
}

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
