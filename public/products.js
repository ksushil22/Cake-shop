var flag=0;
var addProduct=document.getElementById("addProduct");
var divAddProduct=document.getElementById("divAddProduct");
var listOfProducts=document.getElementById("listOfProducts");
var product=[];
var xHTTP = new XMLHttpRequest();
function getProducts(){
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
    xHTTP.open('GET', '/getProducts');
    xHTTP.send();
}
addProduct.addEventListener("click",function(){
    if(flag==0){
        flag=1;
        addProductPanel();
    }
});
function hideAddProductLink(){
    addProduct.setAttribute("style","visibility:hidden;");
}
function unhideAddProductLink(){
    addProduct.setAttribute("style","visibility:visible;");
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

function checkValidation(name,description,price,quantity){
    if(name!=""){
        if(description!=""){
            if(price!=""){
                if(quantity!=""){
                    return true;
                }
                else{
                    alert("please fill the quantity");
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

function addProducttoDatabase(targetElement){
    var productObj=new Object();
    productObj.name=document.getElementById("textName").value;
    productObj.description=document.getElementById("textDescription").value;
    productObj.price=document.getElementById("textPrice").value;
    productObj.quantity=document.getElementById("textQuantity").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                alert("stored successfully");
                console.log(this.responseText);
                const response = JSON.parse(this.responseText);
                console.log(response._id);
                targetElement.id=response._id;
                console.log(targetElement.id);
                document.getElementById("textName").value="";
                document.getElementById("textDescription").value="";
                document.getElementById("textPrice").value="";
                document.getElementById("textQuantity").value="";
                productObj._id = targetElement.id;
                addProductToDOM(productObj);            
            }
    };
    xhttp.open("POST", "/saveProduct", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("product="+JSON.stringify(productObj));
    return productObj;
}

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
    var str="Product name : "+productObj.name+"<br>Description : "+productObj.description+"<br>Price : Rs "+productObj.price+"<br>Quantity : "+productObj.quantity+"<br>";
        var divRow=document.createElement("div");
        divRow.setAttribute("id",productObj._id);
        var product=document.createElement("p");
        product.innerHTML=str;
        divRow.appendChild(product);


        var editBtn=document.createElement("button");
        editBtn.innerHTML="Edit";  var deleteBtn=document.createElement("button");
        deleteBtn.innerHTML="Delete";
        deleteBtn.addEventListener("click",()=> {
            removeFromDatabase(productObj._id,divRow);
        });

        editBtn.addEventListener("click",()=>{
              if(flag==0)             {
                flag=1;
                updateProductPanel(divRow.id);
             }
        });
        divRow.appendChild(editBtn);
        divRow.appendChild(deleteBtn);
        listOfProducts.appendChild(divRow);
        console.log(divRow.id);
}

function replaceProductInDOM(productObj){
    var str="Product name : "+productObj.name+"<br>Description : "+productObj.description+"<br>Price : Rs "+productObj.price+"<br>Quantity : "+productObj.quantity+"<br>";
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
    var divLabel=document.createElement("div");
    divLabel.setAttribute("id","productPanel");

    var labelProduct=document.createElement("label");
    labelProduct.innerHTML="Enter details of the product";
    labelProduct.setAttribute("style","margin-left:50px");
    divLabel.appendChild(labelProduct);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var name=document.createElement("input");
    name.setAttribute("type","text");
    name.setAttribute("id","textName");
    name.setAttribute("placeholder","name of product");
    name.setAttribute("style","width:200px");
    divLabel.appendChild(name);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);


    var description=document.createElement("textarea");
    description.setAttribute("id","textDescription");
    description.setAttribute("placeholder","description");
    description.setAttribute("style","width:200px");
    divLabel.appendChild(description);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);


    var price=document.createElement("input");
    price.setAttribute("type","number");
    price.setAttribute("id","textPrice");
    price.setAttribute("placeholder","price");
    price.setAttribute("style","width:200px");
    divLabel.appendChild(price);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var quantity=document.createElement("input");
    quantity.setAttribute("type","number");
    quantity.setAttribute("id","textQuantity");
    quantity.setAttribute("placeholder","quantity");
    quantity.setAttribute("style","width:200px");
    quantity.setAttribute("required","");
    divLabel.appendChild(quantity);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var addBtn=document.createElement("button");
    addBtn.innerHTML="Add Product";
    addBtn.setAttribute("id","addToList");
    divLabel.appendChild(addBtn);

    var cancelBtn=document.createElement("button");
    cancelBtn.innerHTML="Cancel";
    cancelBtn.setAttribute("id","cancel");
    divLabel.appendChild(cancelBtn);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);
    divAddProduct.appendChild(divLabel);

    cancelBtn.addEventListener("click",function(event){
        flag=0;
        hidePanel(divLabel);
    });

    addBtn.addEventListener("click",function(event){
        if(checkValidation(textName.value,textDescription.value,textPrice.value,textQuantity.value))
            {
                console.log("verified Product");
                flag=0;
                const p = addProducttoDatabase(divLabel);
                product.push(p);
           }
    });

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
    labelProduct.innerHTML="Update Product";
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

    var quantity=document.createElement("input");
    quantity.setAttribute("type","number");
    quantity.setAttribute("id","textQuantity");
    quantity.setAttribute("placeholder","quantity");
    quantity.setAttribute("style","width:250px");
    quantity.value=pro.quantity;
    divLabel.appendChild(quantity);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);

    var updateBtn=document.createElement("button");
    updateBtn.innerHTML="Update";
    updateBtn.setAttribute("id","updateToList");
    divLabel.appendChild(updateBtn);

    var cancelBtn=document.createElement("button");
    cancelBtn.innerHTML="Cancel";
    cancelBtn.setAttribute("id","cancel");
    divLabel.appendChild(cancelBtn);
    insertBlankLine(divLabel);
    insertBlankLine(divLabel);
    divAddProduct.appendChild(divLabel);

    cancelBtn.addEventListener("click",function(event){
        flag=0;
        hidePanel(divLabel);
    });

    updateBtn.addEventListener("click",function(event){
        if(checkValidation(textName.value,textDescription.value,textPrice.value,textQuantity.value))
            {
                   flag=0;
                   var productObj=new Object();
                   productObj._id=id;
                   productObj.name=textName.value;
                   productObj.description=textDescription.value;
                   productObj.price=textPrice.value;
                   productObj.quantity=textQuantity.value;
                   var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                            alert("updaed Successfully");
                        }
                    };
                    xhttp.open("POST", "/updateProduct", true);
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.send("product="+JSON.stringify(productObj));
                   replaceProductInDOM(productObj);
                   hidePanel(divLabel);
            }
    });

}