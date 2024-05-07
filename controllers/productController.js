const ProductModel = require("../models/ProductModel");
const Product = require("../models/ProductModel");

//add products
const add_product = async(req, res)=> {
    try{
        const userId = req.user._id;
        var arrImages = [];
        for(let i=0; i<req.files.length; i++){
            arrImages[i] = req.files[i].filename;
        }
        var product =  new Product({
            name: req.body.name,
            price: req.body.price,
            images: arrImages,
            user: userId
        }); 

        const product_data = await product.save();
        res.status(200).send({success: true, msg: "Product Details", data: product_data});
    }catch(error){
        res.status(400).send({success: false, msg: error.message})
    }
}

//get products
const get_products = async(req, res)=> {
    try{
        const products = await ProductModel.find();
        return res.status(200).json({data: products})
    }catch(error){
      return res.status(400).json({ message: "Error", error });
    }
} 

// Get products by user ID
const get_products_by_user_id = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find products belonging to the user
        const products = await ProductModel.find({ user: userId });

        return res.status(200).json({ data: products });
    } catch (error) {
        return res.status(400).json({ message: "Error", error });
    }
}

//search product
const search_product = async(req, res)=> {
    try{
        var search = req.body.search;
       var search_data = await Product.find({"name": { $regex: ".*"+search+".*", $options: 'i'}});
       if(search_data.length > 0){
            res.status(200).send({success: true, msg: "Product Details: ", data: search_data})
       }else{
        res.status(200).send({success: true, msg: "Products not found!"});
       }
    }catch(error){
        return res.status(400).json({ message: "Error", error });
    }
}

module.exports = {
    add_product,
    get_products,
    get_products_by_user_id,
    search_product
}