
const{credential,credentialsSchema,validateCredential} = require("../models/credentials");
const{cart,cartSchema} = require("../models/cart")
var productsArray=[];
var cart=[];
var users=[];
var navigation=document.getElementById("navigation");
var divListOfProducts=document.getElementById("divListOfProducts");
function refreshUserDetails()
{
    localStorage.user=JSON.stringify(users);
}
function getUserDetails()
{
    if(!localStorage.user)
        {
            localStorage.user=JSON.stringify([]);
        }
    else
        {
            users=JSON.parse(localStorage.user);            
        }
    if(users.length==0)
        {
            var login=document.createElement("a");
            var textNode=document.createTextNode("Login");
            login.appendChild(textNode);
            login.setAttribute("href","login.html")
            navigation.appendChild(login);
            var br = document.createElement("br");
            navigation.appendChild(br);
            var signUp=document.createElement("a");
            var textNode=document.createTextNode("SignUp");
            signUp.appendChild(textNode);
            signUp.setAttribute("href","SignUp.html")
            navigation.appendChild(signUp);
            var prod=document.createElement("p");
            prod.innerHTML="Products :";
            navigation.appendChild(prod);
            
            
        }
        else
            {
            var br = document.createElement("br");
            var greet=document.createElement("p");
            greet.innerHTML="Welcome "+users[0].name+"!";
            navigation.appendChild(greet);
            
                
            var myCart=document.createElement("a");
            var textNode=document.createTextNode(" My Cart");
            myCart.appendChild(textNode);
            myCart.setAttribute("href","cart.html")
            myCart.setAttribute("class","fa fa-shopping-cart")
            navigation.appendChild(myCart);
                navigation.appendChild(br);
            var logout=document.createElement("a");
            var textNode=document.createTextNode("Logout");
            logout.appendChild(textNode);
            logout.setAttribute("href","login.html");
            navigation.appendChild(logout); 
            logout.addEventListener("click",function(event){
                users=[];
                refreshUserDetails();
            });
            var prod=document.createElement("p");
            prod.setAttribute("style","font-weight:bold;");
            prod.innerHTML="Products :";
            navigation.appendChild(prod);
                
        }
}
function storeProducts()
{
    localStorage.cartProducts=JSON.stringify(cart);
}

function getStoredProducts()
{
    getUserDetails();
    if(!localStorage.products)
        {
            localStorage.products=JSON.stringify([]);
        }
    else
        {
            productsArray=JSON.parse(localStorage.products);
            productId=productsArray.indexOf(productsArray[productsArray.length-1])+1;
            
                for(i=0;i<productsArray.length;i++)
                {
                    addProductToDOM(productsArray[i]);
                }
        }
      getStoredCartProducts();
}

function getStoredCartProducts()
{
    if(!localStorage.cartProducts)
        {
            localStorage.cartProducts=JSON.stringify([]);
        }
    else
        {
            cart=JSON.parse(localStorage.cartProducts);
        }
    console.log(cart);
}

function checkValidation(value)
{
    if(value>0 && !isNaN(value))
        {
            return true;
        }
    else
        {
            alert("Quantity must be numeric and greater than Zero!");
            return false;
        }
}

function getProductIndex(id)
{
    for(var i=0;i<productsArray.length;i++)
        {
            if(productsArray[i].id==id)
                {
                    return i;
                }
        }
}

function getCartIndex(id)
{
    for(var i=0;i<cart.length;i++)
        {
            if(cart[i].id==id)
                {   
                    if(cart[i].user==users[0].uname)
                        {
                         return i;
                        }
                }
        }
}

function checkCart(id)
{
    for(var i=0;i<cart.length;i++)
         {
            if(cart[i].id==id)
                {
                    if(cart[i].user==users[0].uname)
                        return true;
                }
          }
    console.log("USER :"+users[0].uname);
   return false;
}

function checkQuantityAvailability(id,value)
{
    console.log(value);
      var index=getProductIndex(id);
     console.log(productsArray[index].quantity);
      if(productsArray[index].quantity>=Number(value))
          {
              return true;
          }
     else
         {
             alert("Quantity not in stock");
             return false;
         }
}

function addProductToDOM(productObj)
{
    var str="Product name : "+productObj.name+"<br>Description : "+productObj.description+"<br>Price : Rs "+productObj.price+"<br>";
        var divRow=document.createElement("div");
        divRow.setAttribute("id",productObj.id);
        var product=document.createElement("p");
        product.innerHTML=str;
        divRow.appendChild(product);
        if(users.length==0)
            {
                var quantity=document.createElement("input");
                quantity.setAttribute("placeholder"," Login First!!!");
                quantity.setAttribute("type","number");
                quantity.setAttribute("disabled","true");
            }
        else if(Number(productObj.quantity)<=0)
        {
          var quantity=document.createElement("input");
            quantity.setAttribute("placeholder"," OUT OF STOCK!!!");
            quantity.setAttribute("type","number");
            quantity.setAttribute("disabled","true");
        }
        else
        {
            var quantity=document.createElement("input");
            quantity.setAttribute("placeholder"," quantity");
            quantity.setAttribute("type","number");
        }
        var addToCart=document.createElement("button");
        addToCart.innerHTML="Add to cart";
        addToCart.setAttribute("style","padding:4px 8px;margin-left: 20px;background-color: grey;border:none;");
        addToCart.addEventListener("click",function(event) {
            if(checkValidation(quantity.value))
                {
                    if(checkQuantityAvailability(divRow.id,quantity.value))
                        {
                            if(checkCart(divRow.id))
                                {
                                    var index=getCartIndex(divRow.id);
                                    var obj=new Object();
                                    obj.user=users[0].uname;
                                    obj.id=divRow.id;
                                    obj.name=productObj.name;
                                    obj.quantity=quantity.value;
                                    obj.price=productObj.price;
                                    obj.total=Number(productObj.price)*Number(quantity.value);
                                    cart.splice(index,1,obj);
                                    storeProducts();
                                    alert("Product added!");
                                    console.log(cart); 
                                }
                            else
                                {
                                    var obj=new Object();
                                    obj.user=users[0].uname;
                                    obj.id=divRow.id;
                                    obj.name=productObj.name;
                                    obj.quantity=quantity.value;
                                    obj.price=productObj.price;
                                    obj.total=Number(productObj.price)*Number(quantity.value);
                                    cart.push(obj);
                                    storeProducts();
                                    alert("Product added!");
                                    console.log(users[0].uname);
                                    console.log(cart);
                                }
                        }
                    
                }
            quantity.value="";
        });
        divRow.appendChild(quantity);
        divRow.appendChild(addToCart);
        divListOfProducts.appendChild(divRow);
        console.log(divRow.id);
        console.log(productsArray);
        
}