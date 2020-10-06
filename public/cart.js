var user=[]
var products=[];
var pArray=[];
var cProducts=[];
var orders=[];
var grant=1;
var total=document.getElementById("total");
var productList=document.getElementById("divListOfProducts");
var totalPrice=0;
function getProducts()
{
    if(!localStorage.cartProducts)
        {
            localStorage.cartProducts=JSON.stringify([]);
        }
    else
        {
            products=JSON.parse(localStorage.products);
            user=JSON.parse(sessionStorage.loggedUsers);
            pArray=JSON.parse(localStorage.cartProducts);
            productId=pArray.indexOf(pArray[pArray.length-1])+1;

                for(i=0;i<pArray.length;i++)
                {
                    if(pArray[i].user==user[0].uname)
                    {
                    cProducts.push(pArray[i]);
                    addProductToDOM(pArray[i]);
                    }
                }
            total.innerHTML=total.innerHTML+totalPrice;
        }
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
            if(products[i].id==id)
                {
                    return i;
                }

        }
}

function deleteProduct(id,element)
{
    var index=getIndex(id);
    console.log(index);
    totalPrice=totalPrice-(Number(pArray[index].quantity)*Number(pArray[index].price));
    removeFromArray(index);
    productList.removeChild(element);
    location.href='cart.html';
}

function addProductToDOM(productObj)
{
    var str="Product name : "+productObj.name+"<br>Price : Rs "+productObj.price+"<br>Quantity : "+productObj.quantity+"<br>Total : Rs "+Number(productObj.price)*Number(productObj.quantity);
    var index=getAllProductIndex(productObj.id);
    var divRow=document.createElement("div");
    divRow.setAttribute("id",productObj.id);
    var product=document.createElement("p");
    product.innerHTML=str;
    console.log(index);
   if(Number(products[index].quantity)<Number(productObj.quantity))
    {
        product.innerHTML="OUT OF STOCK!!!"
    }
    divRow.appendChild(product);
    var deleteBtn=document.createElement("button");
    deleteBtn.innerHTML="Delete";
    divRow.appendChild(deleteBtn);
    deleteBtn.addEventListener("click",function(event) {
        deleteProduct(divRow.id,divRow);
    });
    productList.appendChild(divRow);
    totalPrice+=Number(productObj.price)*Number(productObj.quantity);

}

function checkAvailability()
{
    for(i=0;i<cProducts.length;i++)
        {
            for(j=0;j<products.length;j++)
                {
                    var index=getAllProductIndex(cProducts[i].id);
                    // console.log("index "+index);
                    if(Number(products[index].quantity)<Number(cProducts[i].quantity))
                        {
                            grant=0;
                        }
                }
        }
    // console.log(grant);
    return grant;
}

function checkOut()
{
    if(checkAvailability())
        {
    refreshQuantity();
    pArray=JSON.parse(localStorage.cartProducts);
    for(i=0;i<cProducts.length;i++)
    {
        for(j=0;j<pArray.length;j++)
            {
                if(cProducts[i].user==pArray[j].user)
                    {
                        pArray.splice(j,1);
                        break;
                    }
            }
    }
    cProducts=[];
    saveProduct();
    location.href='cart.html';
}
    else
        {
         alert("Out of stock");
        }
}

function continueToShop()
{
    location.href='viewProducts.html';
}

function refreshQuantity()
{
    for(i=0;i<cProducts.length;i++)
        {
            var index=getAllProductIndex(cProducts[i].id);
            console.log(index);
            products[index].quantity=products[index].quantity-cProducts[i].quantity;
        }
    console.log(products);
    localStorage.products=JSON.stringify(products);
    placeOrder();
}

function placeOrder()
{
    if(!localStorage.orders)
        {
            localStorage.orders=JSON.stringify([]);
        }
    else
        {
            orders=JSON.parse(localStorage.orders);
        }
    for(i=0;i<cProducts.length;i++)
        {
            orders.push(cProducts[i]);
        }
    localStorage.orders=JSON.stringify(orders);
}
