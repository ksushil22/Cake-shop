var flag=0;
var addProduct=document.getElementById("addProduct");
var divAddProduct=document.getElementById("divAddProduct");
var listOfProducts=document.getElementById("listOfProducts");
var product=[];
var xHTTP = new XMLHttpRequest();
function getProducts(){
    if(localStorage.admin=="logged out"||!localStorage.admin){
        window.location.href="login";
    }
    console.log("Getting prodocuts");
    xHTTP.onload = function() {
        product = [];
        product = JSON.parse(this.responseText);
        const length = product.length;
        if(length == 0)
            console.log("no product");
        else{
            for(var i=0; i<length; i++){
                addProductToDOM(product[i]);
            }
            console.log("product found");
        }
    };
    xHTTP.open('GET', '/getProducts',true);
    xHTTP.send();
}
addProduct.addEventListener("click",function(){
    if(flag==0){
        flag=1;
        addProductPanel();
    }
});
function logout(){
    localStorage.admin="logged out";
}
function hideAddProductLink(){
    addProduct.setAttribute("style","visibility:hidden;");
}
function unhideAddProductLink(){
    addProduct.setAttribute("style","visibility:visible; cursor: pointer; text-decoration : none; color : black; cursor: pointer; transition:1s;");
}
function insertBlankLine(targetElement){
    var blankLine=document.createElement("br");
    targetElement.appendChild(blankLine);
}
function hideAddProductPanel(){
    var add = document.getElementById("productPanel");
    add.setAttribute("style","visibility:hidden");
}
function deleteRow(element,id){
    var index=getIndex(id);
    removeFromDatabase(index);
    listOfProducts.removeChild(element);
}
function hidePanel(element){
    divAddProduct.removeChild(element);
    unhideAddProductLink();
}
function getIndex(id){
    let count = 0;
    for(var i=0;i<product.length;i++){
        if(product[i]._id == id)
            return count;
        count++;
    }

}

function checkValidation(name,description,price,available){
    if(name!=""){
        if(description!=""){
            if(price!=""){
                if(available!=""){
                    return true;
                }
                else{
                    alert("please fill the availability");
                    return false;
                }
            }
            else{
                alert("please fill the price");
                return false;
                }
        }
        else{
            alert("please fill the description");
            return false;
        }
    }
    else{
        alert("please fill the product name");
        return false;
    }
}

// function addProducttoDatabase(targetElement){
//     var productObj=new Object();
//     productObj.name=document.getElementById("textName").value;
//     productObj.description=document.getElementById("textDescription").value;
//     productObj.price=document.getElementById("textPrice").value;
//     productObj.available=document.getElementById("textAvailable").value;
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//                 alert("stored successfully");
//                 console.log(this.responseText);
//                 const response = JSON.parse(this.responseText);
//                 console.log(response._id);
//                 targetElement.id=response._id;
//                 console.log(targetElement.id);
//                 document.getElementById("textName").value="";
//                 document.getElementById("textDescription").value="";
//                 document.getElementById("textPrice").value="";
//                 document.getElementById("textAvailable").value="";
//                 productObj._id = targetElement.id;
//                 addProductToDOM(productObj);            
//             }
//     };
//     xhttp.open("POST", "/saveProduct", true);
//     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhttp.send("product="+JSON.stringify(productObj));
//     return productObj;
// }

async function removeFromDatabase(id,divRow)
{
    console.log(`deleting ${id}`);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if(xhr.status == 400){
            console.log(xhr.responseText);
        }
        else{
            console.log(xhr.responseText);
            deleteRow(divRow,divRow.id);
        }
    }
    xhr.open("DELETE", `/product/delete/:${id}`, true);
    xhr.send();
}


function addProductToDOM(productObj){
       var divRow=document.createElement("div");
        divRow.setAttribute("class","col-md-4 product-grid text-center");
        divRow.setAttribute("id",productObj._id);
        insertBlankLine(divRow);
        insertBlankLine(divRow);
        var a = document.createElement("a");
        a.setAttribute("href","#");

        var imgDiv = document.createElement("div");
        imgDiv.setAttribute("class","image");

        var img = document.createElement("img");
        img.setAttribute("src",`getImg/:${productObj._id}`);
        img.setAttribute("class","w-100 img");
        a.appendChild(img);
        imgDiv.appendChild(a);

        var overlay = document.createElement("div");
        overlay.setAttribute("class","overlay");

        var buttons = document.createElement("div");
        buttons.setAttribute("class","buttons");

        var editBtn=document.createElement("button");
        editBtn.innerHTML="      Edit      ";  
        editBtn.setAttribute("class","btn btn-secondary align-center");
        editBtn.setAttribute("id","editButton");
        editBtn.setAttribute("style","width:100%;");
        editBtn.setAttribute("type","button");
        var deleteBtn=document.createElement("button");
        deleteBtn.setAttribute("class","btn btn-danger deleteButton");
        deleteBtn.innerHTML="Delete";
        deleteBtn.setAttribute("type","button");
        deleteBtn.setAttribute("style","width: 100%;");
        deleteBtn.setAttribute("id","deleteButton");
        deleteBtn.addEventListener("click",()=> {
            removeFromDatabase(productObj._id,divRow);
        });

        editBtn.addEventListener("click",()=>{
              if(flag==0)             {
                flag=1;
                updateProductPanel(divRow.id);
             }
        });
        buttons.appendChild(editBtn);
        insertBlankLine(buttons);
        insertBlankLine(buttons);
        buttons.appendChild(deleteBtn);
        
        overlay.appendChild(buttons);
        divRow.appendChild(imgDiv);
        var pName= document.createElement("h4");
        pName.setAttribute("class","text-center");
        pName.innerHTML=productObj.name;
        divRow.appendChild(pName);

        pPrice = document.createElement("h5");
        pPrice.setAttribute("class","text-center");
        pPrice.innerHTML="Rs. "+productObj.price;
        divRow.appendChild(pPrice);
        var pDesc= document.createElement("h6");
        pDesc.setAttribute("class","text-center");
        pDesc.innerHTML=productObj.description;
        divRow.appendChild(pDesc);
        insertBlankLine(divRow);

       
        imgDiv.appendChild(overlay);
        listOfProducts.appendChild(divRow);
        console.log(divRow.id);
}

function replaceProductInDOM(productObj){
    var str="Product name : "+productObj.name+"<br>Description : "+productObj.description+"<br>Price : Rs "+productObj.price+"<br>Availability : "+productObj.available+"<br>";
        var divRow=document.createElement("div");
        divRow.setAttribute("id",productObj.id);
        var product=document.createElement("p");
        product.innerHTML=str;
        divRow.appendChild(product);

        var editBtn=document.createElement("button");
        editBtn.innerHTML="Edit";
        
        var deleteBtn=document.createElement("button");
        deleteBtn.innerHTML="Delete";
        divRow.appendChild(editBtn);
        divRow.appendChild(deleteBtn);
        deleteBtn.addEventListener("click",function(event) {
            deleteRow(divRow,divRow.id);
            insertBlankLine(divRow);
        });

        editBtn.addEventListener("click",function(event){
            if(flag==0)
                {
                    console.log("editing");
                    flag=1;
                    updateProductPanel(divRow.id);
                }
        });
        var index=getIndex(productObj._id);
        listOfProducts.replaceChild(divRow,listOfProducts.childNodes[index+1]);
}

function addProductPanel(){
    hideAddProductLink();
    var divLabel=document.createElement("form");
    divLabel.setAttribute("id","productPanel");
    divLabel.setAttribute("action","/saveProduct");
    divLabel.setAttribute("method","POST");
    divLabel.setAttribute("enctype","multipart/form-data");

    var labelProduct=document.createElement("label");
    labelProduct.innerHTML="Enter details of the product";
    labelProduct.setAttribute("style","margin-left:50px");
    divLabel.appendChild(labelProduct);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var name=document.createElement("input");
    name.setAttribute("type","text");
    name.setAttribute("id","textName");
    name.setAttribute("name","name");
    name.setAttribute("placeholder","name of product");
    name.setAttribute("style","width:200px");
    divLabel.appendChild(name);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);


    var description=document.createElement("textarea");
    description.setAttribute("id","textDescription");
    description.setAttribute("name","description");
    description.setAttribute("placeholder","description");
    description.setAttribute("style","width:200px");
    divLabel.appendChild(description);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);


    var price=document.createElement("input");
    price.setAttribute("type","number");
    price.setAttribute("id","textPrice");
    price.setAttribute("name","price");
    price.setAttribute("placeholder","price");
    price.setAttribute("style","width:200px");
    divLabel.appendChild(price);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var available=document.createElement("input");
    available.setAttribute("type","text");
    available.setAttribute("id","textAvailable");
    available.setAttribute("name","availability");
    available.setAttribute("placeholder","Availability(either yes or no)");
    available.setAttribute("style","width:200px");
    available.setAttribute("required","");
    divLabel.appendChild(available);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var image = document.createElement("input");
    image.setAttribute("type","file");
    image.setAttribute("id","image");
    image.setAttribute("name","image");
    image.setAttribute("style","border:2px solid black");
    divLabel.appendChild(image);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var addBtn=document.createElement("button");
    addBtn.innerHTML="Add Product";
    addBtn.setAttribute("type","submit");
    addBtn.setAttribute("id","addToList");
    addBtn.setAttribute("class","btn btn-dark ");
    divLabel.appendChild(addBtn);

    var cancelBtn=document.createElement("button");
    cancelBtn.innerHTML="Cancel";
    cancelBtn.setAttribute("id","cancel");
    cancelBtn.setAttribute("class","btn btn-cancel ");
    divLabel.appendChild(cancelBtn);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);
    divAddProduct.appendChild(divLabel);

    cancelBtn.addEventListener("click",function(event){
        flag=0;
        hidePanel(divLabel);
    });

}
function uploadImage(id){
    var xHTTP = new XMLHttpRequest();
    xHTTP.onload = function(){
        console.log(JSON.parse(this.responseText));
    }
    xHTTP.open('POST','/uploadImage');
    xHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xHTTP.send("pid="+JSON.stringify(id));
}


function updateProductPanel(id){
    var pro = new Object();
    for(var i=0;i<product.length;i++){
        if(product[i]._id == id)
            pro = product[i];
    }
    console.log(pro);
    hideAddProductLink();
    var divLabel=document.createElement("div");
    var labelProduct=document.createElement("label");
    labelProduct.innerHTML="Enter Updated values";
    labelProduct.setAttribute("style","margin-left:50px");
    divLabel.appendChild(labelProduct);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var name=document.createElement("input");
    name.setAttribute("type","text");
    name.setAttribute("id","textName");
    name.setAttribute("placeholder","name of product");
    name.setAttribute("style","width:250px");
    name.value=pro.name;
    divLabel.appendChild(name);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);


    var description=document.createElement("textarea");
    description.setAttribute("id","textDescription");
    description.setAttribute("placeholder","description");
    description.setAttribute("style","width:250px");
    description.value=pro.description;
    divLabel.appendChild(description);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);


    var price=document.createElement("input");
    price.setAttribute("type","number");
    price.setAttribute("id","textPrice");
    price.setAttribute("placeholder","price");
    price.setAttribute("style","width:250px");
    price.value=pro.price;
    divLabel.appendChild(price);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var available=document.createElement("input");
    available.setAttribute("type","text");
    available.setAttribute("id","textAvailable");
    available.setAttribute("placeholder","Available(either yes or no)");
    available.setAttribute("style","width:250px");
    available.value=pro.available;
    divLabel.appendChild(available);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var updateBtn=document.createElement("button");
    updateBtn.innerHTML="Update";
    updateBtn.setAttribute("id","updateToList");
    updateBtn.setAttribute("class","btn btn-dark ");
    divLabel.appendChild(updateBtn);

    var cancelBtn=document.createElement("button");
    cancelBtn.innerHTML="Cancel";
    cancelBtn.setAttribute("id","cancel");
    cancelBtn.setAttribute("class","btn btn-cancel ");
    divLabel.appendChild(cancelBtn);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);
    divAddProduct.appendChild(divLabel);

    cancelBtn.addEventListener("click",function(event){
        flag=0;
        hidePanel(divLabel);
    });

    updateBtn.addEventListener("click",function(event){
        if(checkValidation(textName.value,textDescription.value,textPrice.value,textAvailable.value))
            {
                   flag=0;
                   var productObj=new Object();
                   productObj._id=id;
                   productObj.name=textName.value;
                   productObj.description=textDescription.value;
                   productObj.price=textPrice.value;
                   productObj.available=textAvailable.value;
                   var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                            alert("updaed Successfully");
                            window.location.href("/products");
                        }
                    };
                    xhttp.open("POST", "/updateProduct", true);
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.send("product="+JSON.stringify(productObj));
                   hidePanel(divLabel);
            }
    });

}