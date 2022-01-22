import { getData } from "./data.js";
const data= getData()

const container = document.querySelector("#itemsOnCart");

const displayItemsOnCart = (arr) => {
  const productsInCart = JSON.parse(localStorage.getItem("itemsOnCart"));
  const cartIcon=document.createElement('p')
  
  cartIcon.innerHTML=`<h4>Cart <span class="price" style="color:black"><i class="fa fa-shopping-cart"></i> <b id='num'>4</b></span></h4>`
  container.appendChild(cartIcon)
  for (let el of arr) {
    const p = document.createElement("p");
    p.innerHTML = `<a href="cart.html" id="">${el.name}</a> <span class="price">${el.price}</span>`;
    container.appendChild(p);
  }
  const num= document.querySelector('#num')
  num.innerHTML=arr.length;
  const pTotal=document.createElement('p');
  pTotal.className='pTotal';
  pTotal.innerHTML=`TOTAL: $${getTotalPrice(arr)}.00`;
  container.appendChild(pTotal);
//   const totP=document.createElement('p')
};

const startPage=()=>{
    const itemsOnCart = JSON.parse(localStorage.getItem('itemsOnCart'))
    const listOfNamesFromLocal= Object.keys(itemsOnCart)
    const array=[]
    const listOfProducts= listOfNamesFromLocal.forEach(el=>{
        for(let obj of data){
            if(el===obj.name) array.push(obj)
        }
    })
    return(array)
}

const getTotalPrice = (arr) => {
  let totPrice = 0;
  const productsInCart = JSON.parse(localStorage.getItem("itemsOnCart"));
  for (let el of arr) {
    let price = Number(el.price.substring(1));
    totPrice += price * productsInCart[el.name];
  }
  return totPrice;
};
displayItemsOnCart(startPage());