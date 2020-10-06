const signIn = document.getElementById("signIn");
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
                window.location.href="/";        
            }
            else if(this.responseText=="\"products\"")
                window.location.href="/products";
            else
                window.location.href="/viewProducts";
            
        }
    };
    xHTTP.open('POST', '/signin');
    xHTTP.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    xHTTP.send('user='+JSON.stringify(user));
});