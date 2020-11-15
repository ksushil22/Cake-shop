const express = require('express');
const app = new express();
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
var fs = require('fs'); 
const {cart}= require('./models/cart');
const {credential,validateCredential}= require('./models/credentials')
const {products,validateProducts,productsSchema}= require('./models/products');
app.use(express.static(path.join(__dirname,'./')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
  
var upload = multer({ storage: storage }); 
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname+'/view/index.html'));
});
app.get('/index', (req,res)=>{
    res.sendFile(path.join(__dirname+'/view/index.html'));
});
app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname+'/view/login.html'))
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
app.get('/cart', (req,res)=>{
    res.sendFile(path.join(__dirname+'/view/cart.html'))
});
app.get('/getImg/:pId',async(req,res)=>{
    console.log("getting image");
    const id = req.params.pId;
    const pId = id.slice(1);
    const product = await products.find({_id: pId});
    return res.send(product[0].img.data);
});
app.post('/saveProduct', upload.single('image'), (req, res, next) => { 
  
    var obj = { 
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        available:req.body.availability,
        img: { 
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)), 
            contentType: 'image/png'
        } 
    } 
    console.log(obj);
    products.create(obj, async(err, item) => { 
        if (err) { 
            console.log(err); 
        } 
        else { 
            console.log(`items are ${item}`);
            const result = await item.save();
            console.log(result);
            res.redirect('/products');
        } 
    }); 
}); 
app.put('/checkOut',async(req,res)=>{
    const details= JSON.parse(req.body.details);
    const updatedCart = await cart.findOneAndUpdate({_id: details.cartId},{
        $set: {
            products: [],
            total: 0
        }
    });
    console.log(updatedCart);
    const result = await cart.find({_id: details.cartId});
    return res.json(result);
});
app.put('/updateCart',async(req,res)=>{
    const details = JSON.parse(req.body.details);
    console.log(details);
    const carts = await cart.find({_id: details.cartId});
    var cost = 0;
    var uPorducts = carts[0].products;
    for(var i =0; i<uPorducts.length;i++){
        if(uPorducts[i]._id==details.productId){
            if(details.quantity==0)
                uPorducts.splice(i,1);
            else{
                cost+=(details.quantity*uPorducts[i].price);                
                uPorducts[i].quantity = details.quantity;
            }
        }
        else
            cost+=(uPorducts[i].quantity*uPorducts[i].price);
    }
    const updatedCart = await cart.findOneAndUpdate({_id: details.cartId},{
        $set: {
            products: uPorducts,
            total: cost
        }
    });
    const result = await cart.find({_id: details.cartId});
    console.log(result);
    return res.json(result);
});
app.put('/addToCart',async(req,res)=>{
    const details = JSON.parse(req.body.details);
    console.log(details);
    const product = await products.find({_id: details.pid});
    console.log(product[0]);
    cost = product[0].price * details.quantity;
    product[0].quantity = details.quantity;
    const uCart = await cart.find({_id: details.cId});
    var found = false;
    var uProducts = uCart[0].products;
    console.log(uCart);
    for(var i=0; i< uProducts.length; i++){
        console.log(`in loop ${uProducts[i]._id}, details.pid: ${details.pid}`);
        if(uProducts[i]._id==details.pid){
            console.log(`product found`);
            found = true;
            uProducts[i].quantity = uProducts[i].quantity + Number(details.quantity);
            uCart[0].total+= cost;
        }
    }
    if(found == false){
        uProducts.push(product[0]);
        uCart[0].total+= cost;
    }
    console.log(`uPorducts: ${uProducts}  uCart[0].total: ${uCart[0].total}`);
    const updatedCart = await cart.findOneAndUpdate({_id: details.cId},{
        $set: {
            products: uProducts,
            total: uCart[0].total
        }
    });
    console.log(updatedCart);
    const result = await cart.find({_id: details.cId});
    return res.json(result);
});
app.get('/getCart/:id',async(req,res)=>{
    const id = req.params.id;
    const userId = id.slice(1);
    console.log(`getting cart for ${id} `);
    const userCart = await cart.find({id: userId});
    console.log(userCart);
    return res.json(userCart);
}); 
app.get('/getUser/:id',async(req, res)=>{
    console.log("getting user");
    console.log(JSON.stringify(req.params.id));
    const id = req.params.id;
    const userid = id.slice(1);
    console.log(`${id} ${userid}`);
    const userLogged = await credential.find({_id : userid});
    console.log(userLogged);
    return res.json(userLogged);
});
app.get('/getProducts',async(req,res)=>{
    console.log("finding product");
    const Products = await products.find();
    return res.json(Products);
});
app.post('/signin', async(req,res)=>{
    loggedUser=[];
    console.log("here");
    const user = JSON.parse(req.body.user);
    console.log(user.username);
    const a="products";
    const b="viewProducts";
    const c="same";
    if(user.username=='admin' && user.password=='admin')
        return res.json(a);   
    const credentials=  await credential.find({username : user.username});
    console.log(credentials[0]._id);
    if(credentials.length!=0){        
        if(credentials[0].password == user.password){
            return res.json(credentials[0]._id);
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
    console.log("saving user");
    let users = JSON.parse(req.body.user); 
    if(validateCredential(users)){
        const credentials= new credential(users);
        const result = await credentials.save();
        const userId = result._id;
        const carts = new cart({
            id: userId,
            credentials: result,
            products: [],
            total: 0
        });
        const resultCart = await carts.save();
        console.log(`cart created ${resultCart}`);
        console.log(`user created ${result}`);  
        const r = result._id;
        return res.json(r);
    }
    else{        
        console.log("Wrong enteries..");
        return res.json("false");
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
        return res.json(null);
    }
});
// app.post('/saveProduct', async(req,res)=>{
//     const Prod = JSON.parse(req.body.product);
//     console.log(Prod); 
//     const product = new products(Prod);
//     if(validateProducts(product)){
//         const result = await product.save();
//         console.log(result);
//         return res.json(result);
//     }
//     else
//         return res.json(result);

// });
app.post('/updateProduct',async (req,res)=>{
    const prod  = JSON.parse(req.body.product);    
    const result = await products.updateOne({ _id: prod._id},{
        $set: {
            name : prod.name,
            description : prod.description,
            price : prod.price,
            available: prod.available,
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