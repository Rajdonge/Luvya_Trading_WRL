const Joi = require('joi');

//product validation
const productValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().required(),
        images: Joi.array().items(Joi.string()).min(1).max(5)
    });
    const { error, value } = schema.validate(req.body);
    if(error){
        return res.status(400).json({message: "Bad request", error})
    }
    next();
}

module.exports = {
    productValidation
}