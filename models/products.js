const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shopping',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('connected to database'))
.catch(err => console.error(err.message));
const Joi = require('joi');
const productsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    description:{
        type: String,
        required: true,
        min:10
    },
    price:{
        type: Number,
        required: true,
        min: 0,
    },
    quantity:{
        type: Number,
        required: true,
        min: 0
    }
})

const products = mongoose.model('products',productsSchema);

function validate(products){
    const Schema={
        id: Joi.number().required(),
        name: Joi.string().required().min(3).max(50),
        price: Joi.number().required().min(0),
        quantity: Joi.number().required().min(0)
    }
    return Joi.validate(products,Schema);
}

exports.productsSchema = productsSchema;
exports.products = products;
exports.validateProducts = validate;