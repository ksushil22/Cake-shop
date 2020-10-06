const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/shopping',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("connected to database"))
.catch(err=> console.log(err.message));
const {credentialsSchema} = require('./credentials');
const{productsSchema}= require('./products');
const cartSchema= new mongoose.Schema({
    id:{
        type:Number,
        required: true
    },
    credentials: credentialsSchema,
    products: [productsSchema],
    total:{
        type: Number,
        required: true
    }
});

const cart= new mongoose.model('cart', cartSchema);

exports.cartSchema = cartSchema;
exports.cart = cart;