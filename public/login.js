function check(){
    if(localStorage.user.length>2){
        console.log("already logged in");
        window.location.href="/viewProducts";
    }
}
const signIn = document.getElementById("signIn");
console.log(localStorage.user.length);
signIn.addEventListener("click",()=>{
    let uname = document.getElementById("uname").value.trim();
    const pass = document.getElementById("password").value.trim();
    const user = new Object({
        username: uname,
        password:pass
    });
    var xHTTP = new XMLHttpRequest();
    xHTTP.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.responseText=="\"same\""){
                const error = document.getElementById("error");
                error.hidden=false;                    
            }
            else if(this.responseText=="\"products\""){  
                localStorage.admin = "logged in";          
                window.location.href="/products";            
            }
            else{
                localStorage.userid=JSON.parse(this.responseText);
                getUser();
            }
            
        }
    };
    xHTTP.open('POST', '/signin');
    xHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xHTTP.send('user='+JSON.stringify(user));
});


async function getUser(){
    const id = localStorage.userid;
    console.log(`getting user for id ${id}`);
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload=function(){
        localStorage.user = this.responseText;
        console.log(localStorage.user);
        getCart();
    }
    xHTTP.open("GET",`/getUser/:${id}`);
    xHTTP.send();
}

function getCart(){    
    const id = localStorage.userid;
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload = function(){
        localStorage.cart = this.responseText; 
        console.log(localStorage.cart);    
        window.location.href="/";
    }
    xHTTP.open('GET',`/getCart/:${id}`);
    xHTTP.send();
}

var navigation = document.getElementById("navigation");
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