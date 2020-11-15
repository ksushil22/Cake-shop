var user=[]
var products=[];
var pArray=[];
var cProducts=[];
var orders=[];
var carts=[];
var grant=1;
var total=document.getElementById("total");
var productList=document.getElementById("divListOfProducts");
var totalPrice=0;
var navigation = document.getElementById("navigation");

function getProducts()
{
    user = JSON.parse(localStorage.user);
    console.log(user[0].name);
    var home = document.createElement("a");
    home.setAttribute("href","/");
    home.setAttribute("class","nav-link");

    var homeSpan = document.createElement("span");
    homeSpan.innerHTML=" Home";
    homeSpan.setAttribute("class","fa fa-home");
    home.appendChild(homeSpan);

    var liHome = document.createElement("li");
    liHome.setAttribute("class","nav-item");
    liHome.appendChild(home);
    navigation.appendChild(liHome);

    var liProduct = document.createElement("li");
    liProduct.setAttribute("class","nav-item");

    var product= document.createElement("a");
    product.setAttribute("class","nav-link");
    product.setAttribute("href","viewProducts");

    var productSpan = document.createElement("span");
    productSpan.innerHTML="Products";
    productSpan.setAttribute("class","fa fa-birthday-cake");
    product.appendChild(productSpan);

    liProduct.appendChild(product);
    navigation.appendChild(liProduct);
        
    var liCart = document.createElement("li");
    liCart.setAttribute("class","nav-item");

    var myCart=document.createElement("a");
    myCart.setAttribute("href","cart")
    myCart.setAttribute("class","nav-link")
    myCart.setAttribute("style","background-color: #f5abf5; color:white; outline:none; transition: 0.2s ease;")

    var cartSpan = document.createElement("span")
    cartSpan.innerHTML="My Cart"
    cartSpan.setAttribute("class","fa fa-shopping-cart");
    myCart.appendChild(cartSpan);

    liCart.appendChild(myCart);
    navigation.appendChild(liCart);

    var iLogin = document.createElement("li");
    iLogin.setAttribute("class","nav-item");
    var no = document.createElement("a");
    no.setAttribute("class","nav-link");
    iLogin.appendChild(no);

    var liLogout = document.createElement("li");
    liLogout.setAttribute("class","nav-item");

    var logout=document.createElement("a");
    logout.setAttribute("href","login");
    logout.setAttribute("class","nav-link");

    var logoutSpan = document.createElement("span");
    logoutSpan.innerHTML="Logout";
    logoutSpan.setAttribute("class","fa fa-sign-out");
    logout.appendChild(logoutSpan);

    liLogout.appendChild(logout); 
    navigation.appendChild(liLogout);
    logout.addEventListener("click",function(event){
        user=[];
        carts=[];
        refreshUserDetails();
        refreshCartDetails();
    });


    var liGreet = document.createElement("li");
    liGreet.setAttribute("class","nav-item");

    var greet = document.createElement("a");
    greet.setAttribute("class","nav-link");
    greet.setAttribute("style","color: black;");
    greet.setAttribute("href","/")

    var greetSpan = document.createElement("span");
    greetSpan.innerHTML=user[0].name;
    greetSpan.setAttribute("class","fa fa-user");
    greet.appendChild(greetSpan);

    liGreet.appendChild(greet);
    navigation.appendChild(greet);
    
    if(!localStorage.cartProducts)
        {
            localStorage.cartProducts=JSON.stringify([]);
        }
    if(localStorage.user.length == 2){
        window.location.href="/login"
    }
    else
        {
            carts = JSON.parse(localStorage.cart);
            products= carts[0].products;
            if(products.length == 0){
                var nP = document.getElementById("nProduct");
                var img = document.createElement("img");
                img.setAttribute("src","../uploads/ecart.png");
                img.setAttribute("class","text-center eCart");
                nP.appendChild(img);
            }
            else{
                pArray=  products;
                productId=pArray.indexOf(pArray[pArray.length-1])+1;
                
                var c = document.createElement("h3");
                c.innerHTML="Your Products";
                c.setAttribute("class","text-center");
                productList.appendChild(c);
                var hr = document.createElement("hr");
                productList.appendChild(hr);
                for(i=0;i<pArray.length;i++){
                    cProducts.push(pArray[i]);
                    addProductToDOM(pArray[i]);
                    insertBlankLine(productList);
                }
                var t = document.createElement("h4");
                t.innerHTML = "Total: "+ carts[0].total;
                productList.appendChild(t);
                addButtons();
                total.innerHTML=total.innerHTML+carts[0].total;

            }
        }
}

function refreshUserDetails()
{
    localStorage.user=JSON.stringify(user);
}
function refreshCartDetails(){
    localStorage.cart = JSON.stringify(carts);
}
function logout(){
        user=[];
        carts=[];
        refreshUserDetails();
        refreshCartDetails();
}
function insertBlankLine(targetElement){
    var blankLine=document.createElement("br");
    targetElement.appendChild(blankLine);
}
function saveProduct()
{
    localStorage.cartProducts=JSON.stringify(pArray);
}

function removeFromArray(index)
{
   pArray.splice(index,1);
   saveProduct();
}

function getIndex(id)
{
    for(var i=0;i<pArray.length;i++)
        {
            if(pArray[i].user==user[0].uname)
            {
            if(pArray[i].id==id)
                {
                     return i;
                }
            }
        }
}

function getAllProductIndex(id)
{
    for(var i=0;i<products.length;i++)
        {
            if(products[i]._id==id)
                {
                    return i;
                }

        }
}

function updateProduct(id,quantity)
{
    console.log(id, quantity,carts[0]._id);
    var xHTTP = new XMLHttpRequest();
    const details = {
        productId:id,
        quantity: quantity,
        cartId: carts[0]._id
    };
    xHTTP.onload = function(){
        localStorage.cart=this.responseText;
        console.log(localStorage.cart);        
        carts=JSON.parse(localStorage.cart);
        window.location.href="/cart"
    };
    xHTTP.open("PUT","/updateCart",true);   
    xHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xHTTP.send("details="+JSON.stringify(details));  
}

function addProductToDOM(productObj) 
{
    var row = document.createElement("div");
    row.setAttribute("class","col product");
    row.setAttribute("id",productObj._id);

    var divRow=document.createElement("div");
    divRow.setAttribute("id",productObj._id);
   
    var name = document.createElement("h5");
    name.innerHTML=productObj.name;
    divRow.appendChild(name);

    var cost = document.createElement("h7");
    cost.innerHTML = "Rs. "+(productObj.price*productObj.quantity);
    divRow.appendChild(cost);

    insertBlankLine(divRow);


    var q=document.createElement("input");
    q.setAttribute("placeholder","Quantity");
    q.setAttribute("type","number");
    q.setAttribute("style","outline: none; border: none; border-bottom: 1px solid black;")
    q.value= productObj.quantity;
    divRow.appendChild(q);


    var updButton=document.createElement("button");
    updButton.innerHTML="update";
    updButton.setAttribute("class","btn btn-light")
    divRow.appendChild(updButton);
    updButton.addEventListener("click",function(event) {
        updateProduct(divRow.id,q.value);
    });
    

    var a = document.createElement("a");
    a.setAttribute("href","#");
    var imgDiv = document.createElement("div");
    imgDiv.setAttribute("class","image");
    
    var img = document.createElement("img");
    img.setAttribute("src",`getImg/:${productObj._id}`);
    img.setAttribute("class","w-100 img");
    img.setAttribute("style","max-height: 100px; max-width: 100px; float: right; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);");
    a.appendChild(img);
    imgDiv.appendChild(a);
    row.appendChild(divRow)
    row.appendChild(imgDiv);
    productList.appendChild(row);
}
function addButtons(){
    var checkOut = document.createElement("button");
    checkOut.innerHTML = "CheckOut";
    checkOut.setAttribute("class","btn btn-success");
    checkOut.setAttribute("onclick","checkOut()");
    productList.appendChild(checkOut);
    var continueToShop = document.createElement("a");
    continueToShop.setAttribute("type","button");
    continueToShop.innerHTML="Continue Shopping";
    continueToShop.setAttribute("class","btn btn-secondary");
    continueToShop.setAttribute("href","viewProducts");
    continueToShop.setAttribute("style","color: white;")
    productList.appendChild(continueToShop);
}
function checkOut(){
    const details = {
        cartId: carts[0]._id
    };
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload = function () {
        localStorage.cart=this.responseText;
        console.log(localStorage.cart);        
        carts=JSON.parse(localStorage.cart);
        window.location.href="/cart";
    }

    xHTTP.open("PUT","/checkOut",true);
    xHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');     
    xHTTP.send("details="+JSON.stringify(details));  
}

function continueToShop()
{
    window.location.href='/viewProducts';
}

