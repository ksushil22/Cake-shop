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
                xHTTP.onload = ()=> {
                    const response = JSON.parse(xHTTP.responseText);
                    if(response == true){
                        window.location.href="/viewProducts";
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
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload = () =>{
        const reply = JSON.parse(xHTTP.responseText);
        console.log(reply);
        if(reply == "true"){
            user.setAttribute("style","border : 1px solid red")
            user.setCustomValidity("user already exist");
        }
        else{
            user.setAttribute("style","border : 1px solid green");
            user.setCustomValidity("");
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
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload = () =>{
        const reply = JSON.parse(xHTTP.responseText);
        console.log(reply);
        if(reply == "true"){
            user.setAttribute("style","border : 1px solid red")
            user.setCustomValidity("user already exist");
        }
        else{
            user.setAttribute("style","border : 1px solid green");
            user.setCustomValidity("");
        }
    }
    xHTTP.open('POST', '/findEmail');                
    xHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xHTTP.send('email='+email);
}

