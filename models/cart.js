const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cakeshop',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("connected to database"))
.catch(err=> console.log(err.message));
const {credentialsSchema} = require('./credentials');
const{productsSchema}= require('./products');
const cartSchema= new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    credentials: credentialsSchema,
    products: [productsSchema],
    total:{
        type: Number
    }
});

const cart= mongoose.model('cart', cartSchema);

exports.cart = cart;
exports.cartSchema = cartSchema;