var productsArray=[];
var users=[];
var carts=[];
var navigation=document.getElementById("navigation");
var divListOfProducts=document.getElementById("divListOfProducts");
async function getStarted(){
    console.log("searching for products");
    getUserDetails();
    await getStoredProducts();
    productsArray=JSON.parse(localStorage.products);
    productId=productsArray.indexOf(productsArray[productsArray.length-1])+1;
         
    for(i=0;i<productsArray.length;i++){
        addProductToDOM(productsArray[i]);
    }
    getCartDetails();
}
function refreshUserDetails()
{
    localStorage.user=JSON.stringify(users);
}
function refreshCartDetails(){
    localStorage.cart = JSON.stringify(carts);
}
function getStoredProducts(){    
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload= function(){
        localStorage.products = this.responseText;
    }
    xHTTP.open('GET','/getProducts', true);
    xHTTP.send();
}
function getCartDetails(){
    if(!localStorage.cart)
        localStorage.cart= JSON.stringify([]);
    else
        carts=JSON.parse(localStorage.cart);
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
            product.setAttribute("style","background-color: #f5abf5; color:white; outline:none; transition: 0.2s ease;")

            var productSpan = document.createElement("span");
            productSpan.innerHTML="Products";
            productSpan.setAttribute("class","fa fa-birthday-cake");
            product.appendChild(productSpan);

            liProduct.appendChild(product);
            navigation.appendChild(liProduct);

            var login=document.createElement("a");
            login.setAttribute("href","login")
            login.setAttribute("class","nav-link");

            var loginSpan = document.createElement("span");
            loginSpan.innerHTML=" SignIn ";
            loginSpan.setAttribute("class","fa fa-sign-in");
            login.appendChild(loginSpan);

            var liLogin = document.createElement("li");
            liLogin.setAttribute("class","nav-item");
            liLogin.appendChild(login);
            navigation.appendChild(liLogin);
            


            var signUp=document.createElement("a");
            signUp.setAttribute("href","signUp")
            signUp.setAttribute("class","nav-link");

            var signupSpan = document.createElement("span");
            signupSpan.innerHTML=" SignUp";
            signupSpan.setAttribute("class","fa fa-user-plus");
            signUp.appendChild(signupSpan);

            var liSignup = document.createElement("li");
            liSignup.setAttribute("class","nav-item");
            liSignup.appendChild(signUp);
            navigation.appendChild(liSignup);
            
            
        }
        else{
            
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
            product.setAttribute("style","background-color: #f5abf5; color:white; outline:none; transition: 0.2s ease;")

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
                users=[];
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
            greetSpan.innerHTML=users[0].name;
            greetSpan.setAttribute("class","fa fa-user");
            greet.appendChild(greetSpan);

            liGreet.appendChild(greet);
            navigation.appendChild(greet);
                
        }
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
                    console.log(`retuning ${i}`);
                    return i;
                }
        }
}

function checkQuantityAvailability(id,value){
    return true;
}

function insertBlankLine(targetElement){
    var blankLine=document.createElement("br");
    targetElement.appendChild(blankLine);
}

async function addProductToDOM(productObj)
{
    if(productObj.available === "no"){
        return;
    }
    console.log(productObj.available);
        var divRow=document.createElement("div");
        divRow.setAttribute("class","col-md-4 col-sm-6 product-grid");
        divRow.setAttribute("id",productObj._id);

        var a = document.createElement("a");
        a.setAttribute("style","cursor: pointer;");
        a.setAttribute("id","myImg");
        a.setAttribute("class","fh5co-card-item image-popup");

        var figure = document.createElement("figure");
        
        var di = document.createElement("div");
        di.setAttribute("class","overlay");
        var i = document.createElement("i");
        i.setAttribute("class","ti-plus");
        di.appendChild(i);
        figure.appendChild(di);

        var img = document.createElement("img");
        img.setAttribute("src",`getImg/:${productObj._id}`);
        img.setAttribute("class","w-100 img-responsive");
        img.setAttribute("alt",productObj.name);
        figure.appendChild(img);

        var d = document.createElement("div");
        d.setAttribute("class","fh5co-text");


        var name = document.createElement("h2");
        name.innerHTML=productObj.name;

        var details = document.createElement("p");
        details.innerHTML= productObj.description;

        pPrice = document.createElement("h5");
        pPrice.setAttribute("class","price cursive-font");
        pPrice.innerHTML="₹ "+productObj.price;
        divRow.appendChild(pPrice);        
        var addToCart=document.createElement("button");
        addToCart.innerHTML="Add to cart";
        addToCart.setAttribute("style","padding:4px 8px;margin-left: 20px;background-color: grey;border:none;");
        if(users.length==0)
            {
                var quantity=document.createElement("input");
                quantity.setAttribute("placeholder"," Login First!!!");
                quantity.setAttribute("type","number");
                quantity.setAttribute("disabled","true");
                addToCart.addEventListener("click",function(event) {
                    window.location.href = "login";
                });
                
            }
        else
        {
            var quantity=document.createElement("input");
            quantity.setAttribute("placeholder","Quantity");
            quantity.setAttribute("type","number");
            addToCart.addEventListener("click",function(event) {
                if(checkValidation(quantity.value)){   
                    addProductToCart(divRow.id,quantity.value);
                }
                quantity.value="";
            });
        }
        d.appendChild(name);
        var hr = document.createElement("hr");
        d.appendChild(hr);
        d.appendChild(details);
        insertBlankLine(d);
        d.appendChild(pPrice);        
        d.appendChild(quantity);
        d.appendChild(addToCart);

        a.appendChild(figure);
        a.append(d);
        img.addEventListener("click",()=>{
            var modal = document.getElementById("myModal");
            
            // Get the image and insert it inside the modal - use its "alt" text as a caption
            var img = document.getElementById("myImg");
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");

            img.addEventListener("click",()=>{                    
              console.log("showing");
              modal.style.display = "block";
              modalImg.src = this.src;
              captionText.innerHTML = this.alt;
            })
            
            // Get the <span> element that closes the modal
            var span = document.getElementsByClassName("close")[0];
            
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() { 
              modal.style.display = "none";
            }

        });
        divRow.appendChild(a);
        divListOfProducts.appendChild(divRow);   
        
        // var modal = document.createElement("div");
        // modal.setAttribute("class","modal");
        // modal.setAttribute("id","myModal");

        // var mSpan=document.createElement("span");
        // mSpan.setAttribute("class","close");
        // mSpan.innerHTML="&times;";
        // modal.appendChild(mSpan);

        // var mImg = document.createElement("img");
        // mImg.setAttribute("class","modal-content");
        // mImg.setAttribute("id","img01");
        // modal.appendChild(mImg);

        // var mCaption = document.createElement("div");
        // mCaption.setAttribute("id","caption");
        // modal.appendChild(mCaption);


        // divListOfProducts.appendChild(modal);
        console.log(`Added product of id: ${divRow.id}`);
        
}

function addProductToCart(pId, quantity){
    console.log(`adding product with id: ${pId} with quantity ${quantity} to ${carts[0]._id}'s cart`);
    const details = {
        pid: pId,
        cId: carts[0]._id,
        quantity: quantity
    };
    console.log(details);
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload = function () {
        localStorage.cart=this.responseText;
        console.log(localStorage.cart);        
        carts=JSON.parse(localStorage.cart);
    }
    xHTTP.open("PUT","/addToCart");   
    xHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xHTTP.send("details="+JSON.stringify(details));
}