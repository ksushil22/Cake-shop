const express = require('express');
const session = require('express-session');
const app = new express();
var bodyParser = require('body-parser')
const path = require('path');
const {cart,cartSchema}= require('./models/cart');
const {credential,credentialsSchema,validateCredential}= require('./models/credentials')
const {products,productsSchema,validateProducts}= require('./models/products');
app.use(express.static(path.join(__dirname,'./')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname+'/view/login.html'));
});
app.get('/getProducts',async (req,res)=>{
    console.log("finding product");
    const Products = await products.find();
    return res.json(Products);
});
app.post('/signin', async(req,res)=>{
    console.log("here");
    const user = JSON.parse(req.body.user);
    console.log(user.username);
    const a="products";
    const b="view products";
    const c="same";
    if(user.username=='admin' && user.password=='admin')
        return res.json(a);   
    const credentials=  await credential.find({username : user.username});
    console.log(credentials);
    if(credentials.length!=0){        
        if(credentials[0].password == user.password){
            return res.json(b);
        }
        else{
            return res.json(c);
        }
    }
    else{
        return res.json(c);
    }
});
app.post('/saveUser',async (req,res)=>{
    let users = JSON.parse(req.body.user); 
    console.log(users);
    if(validateCredential(users)){
        const credentials= new credential(users);
        const result = await credentials.save();
        console.log(result);  
        return res.json(true);
    }
    else{        
        console.log("Wrong enteries..");
        return res.json(null);
    }
});
app.post('/findUname',async (req,res)=>{
    const uname = req.body.uname;
    console.log("finding username "+ uname);
    const credentials = await credential.find({username : uname});
    console.log(credentials.length);
    if(credentials.length>0){
        console.log("found");
        return res.json("true");
    }
    else{
        console.log("new User");
        return res.json("false");
    }
});
app.post('/findEmail',async (req,res)=>{
    const email = req.body.email;
    console.log("finding email "+ email);
    const credentials = await credential.find({email : email});
    console.log(credentials.length);
    if(credentials.length>0){
        console.log("found");
        return res.json("true");
    }
    else{
        console.log("new User");
        return res.json("false");
    }
});
app.post('/saveProduct', async(req,res)=>{
    const Prod = JSON.parse(req.body.product);
    console.log(Prod); 
    const product = new products(Prod);
    if(validateProducts(product)){
        const result = await product.save();
        console.log(result);
        return res.json(result);
    }
    else
        return res.json(result);

});
app.post('/updateProduct',async (req,res)=>{
    const prod  = JSON.parse(req.body.product);    
    const result = await products.updateOne({ _id: prod._id},{
        $set: {
            name : prod.name,
            description : prod.description,
            price : prod.price,
            quantity : prod.quantity
        }
    });
    console.log(result);
});
app.post('/getProduct/id', async(req,res)=>{
    const id = JSON.parse(req.body.id);
    const result = await products.find({_id : id});
    return res.json(result);

});
app.get('/signUp', (req,res)=>{
    res.sendFile(path.join(__dirname+'/view/SignUp.html'));
}); 

app.get('/products',(req,res)=>{
    res.sendFile(path.join(__dirname+'/view/products.html'));
});

app.get('/viewProducts',(req,res)=>{
    res.sendFile(path.join(__dirname+'/view/viewProducts.html'));
});
app.delete('/product/delete/:id',async(req,res)=>{
    console.log("deletng ");
    const i = req.params.id;
    const id = i.slice(1);
    console.log(id,i);
    const result = await products.findByIdAndRemove(id);
    if(!result) return res.status(404).send("the product doesnot exist");
    return res.send(result);
});
app.listen(8080);
console.log('listening to port 8080');