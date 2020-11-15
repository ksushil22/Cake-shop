function isAlphabetic(name,msg)
{
    var expr=/^[A-Za-z ]{1,20}$/;
    var isValid=expr.test(name.value);
    if(isValid==false){
            name.setCustomValidity(msg);
            return false;
        }
    else{
        name.setCustomValidity("");    
        return true;
    }
}
function isUnameValid(uname,msg)
{
    var expr=/^[A-Za-z0-9_]{3,10}$/;
    var isValid=expr.test(uname.value);
    if(isValid==false)
        {
            uname.setCustomValidity(msg);
            return false;
        }
    else
        return true;
}

function isEmail(email,msg)
{
    var expr=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    var isValid=expr.test(email.value);
    if(isValid==false)
        {
            email.setCustomValidity(msg);
            return false;
        }
    else
        return true;
}
function checkValidation()
{
    var name=document.getElementById("name");
    var uname=document.getElementById("uname");
    var password=document.getElementById("password");
    var emailadress=document.getElementById("email");
    if(isAlphabetic(name,"enter a valid name")){
        if(isUnameValid(uname,"enter a valid username (min length:3 & max lentgh:10)")){
            if(isEmail(emailadress,"enter a valid email")){
                const users=new Object({
                    name:name.value.trim(),
                    email:emailadress.value.trim(),
                    username:uname.value.trim(),
                    password:password.value.trim(),
                });               
                var xHTTP = new XMLHttpRequest();
                xHTTP.onreadystatechange = function() {
                    if(this.readyState == 4 && this.status == 200){
                        const id = this.responseText.slice(1,-1);
                        console.log(id);
                        localStorage.userid = id;
                        getUser();
                    }
                };
                xHTTP.open('POST', '/saveUser');                
                xHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
                xHTTP.send('user='+JSON.stringify(users));
                return true; 
            }
        }
    }
    
    return false;
}


async function getUser(){
    const id = localStorage.userid;
    console.log(`getting user for id ${id}`);
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload=function(){
        localStorage.user = this.responseText;
        getCart();
    }
    xHTTP.open("GET",`/getUser/:${id}`);
    xHTTP.send();
}

function getCart(){    
    const id = localStorage.userid;
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload = function(){
        console.log("collecting data");
        console.log(this.responseText);
        localStorage.cart = this.responseText;
        console.log(localStorage.cart);        
        window.location.href="/viewProducts";
    }
    xHTTP.open('GET',`/getCart/:${id}`);
    xHTTP.send();
}




let typingTimer;                
let doneTypingInterval = 1000;  
let myInput = document.getElementById('uname');

myInput.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    if (myInput.value) {
        typingTimer = setTimeout(checkUsername, doneTypingInterval);
    }
});
function checkUsername(){
    const user = document.getElementById("uname");
    const username = user.value.trim();      
    const button = document.getElementById("btn");        
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload = () =>{
        const reply = JSON.parse(xHTTP.responseText);
        console.log(reply);
        if(reply == "true"){
            user.setAttribute("style","border : 1px solid red")
            user.setCustomValidity("user already exist");
            button.disabled=true;
        }
        else{
            user.setAttribute("style","border : 1px solid green");
            user.setCustomValidity("");
            button.disabled=false;
        }
    }
    xHTTP.open('POST', '/findUname');                
    xHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xHTTP.send('uname='+username);
}

let em = document.getElementById('email');

em.addEventListener('keyup', () => {
    clearTimeout(typingTimer);
    if (myInput.value) {
        typingTimer = setTimeout(checkEmail, doneTypingInterval);
    }
});
function checkEmail(){
    const user = document.getElementById("email");
    const email = user.value.trim();   
    const button = document.getElementById("btn");                
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload = () =>{
        const reply = JSON.parse(xHTTP.responseText);
        console.log(reply);
        if(reply == "true"){
            user.setAttribute("style","border : 1px solid red")
            user.setCustomValidity("user already exist");
            button.disabled=true;
            
        }
        else{
            user.setAttribute("style","border : 1px solid green");
            user.setCustomValidity("");
            button.disabled=false;
        }
    }
    xHTTP.open('POST', '/findEmail');                
    xHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xHTTP.send('email='+email);
}

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
            