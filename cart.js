import { getData } from "./data.js";

const data = getData();
const container = document.querySelector(".container");

const showOnCartPage = (array, total) => {
  const productsInCart = JSON.parse(localStorage.getItem("itemsOnCart"));
  const itemNum = document.querySelector("#itemNum");
  const price = document.querySelector("#price");
  itemNum.innerHTML = totalItems();
  price.innerHTML = `$${total}`;
  for (let el of array) {
    const div = document.createElement("div");
    div.className = "card";
    const img = document.createElement("img");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    const button = document.createElement("button");
    // const priceDiv = document.createElement("div");
    const imgDiv = document.createElement("div");
    const txtDiv = document.createElement("div");
    const qty = document.createElement("p");

    imgDiv.className = "imgDiv";
    // priceDiv.className = "priceDiv";
    txtDiv.className = "txtDiv";
    qty.className = "qty";
    img.src = el.image;
    h3.innerHTML = el.name;
    qty.innerHTML = "Qty: " + productsInCart[el.name];
    //   `<span class="qty">Qty:</span><select name="qty" class="num-select" id=${el.img}>
    //     <option value=1>1</option>
    //     <option value=2>2</option>
    //     <option value=3>3</option>
    //     <option value=4>4</option>
    //     <option value=5>5</option>
    //     <option value=6>5+</option>
    //     </select>`;
    //   const select= document.getElementById(`${el.img}`)
    //   select.value = productsInCart[el.name];
    let price = Number(el.price.substring(1));
    p.innerHTML = `$${(price * productsInCart[el.name]).toLocaleString(
      "en-US"
    )}`;
    const eachPrice = document.createElement("p");
    eachPrice.className = "eachPrice";
    button.innerHTML = "Remove";
    button.className = "remove";
    button.id = el.name;
    imgDiv.appendChild(img);
    txtDiv.appendChild(h3);
    txtDiv.appendChild(qty);
    imgDiv.appendChild(txtDiv);
    txtDiv.appendChild(p);
    if (productsInCart[el.name] > 1) {
      eachPrice.innerHTML = `$${price} each`;
      txtDiv.appendChild(eachPrice);
    }

    txtDiv.appendChild(button);
    div.appendChild(imgDiv);
    // div.appendChild(priceDiv);
    container.appendChild(div);

    button.addEventListener("click", deleteItem);
  }
};

const startPage = () => {
  const itemsOnCart = JSON.parse(localStorage.getItem("itemsOnCart"));
  const listOfNamesFromLocal = Object.keys(itemsOnCart);
  const array = [];
  const listOfProducts = listOfNamesFromLocal.forEach((el) => {
    for (let obj of data) {
      if (el === obj.name) array.push(obj);
    }
  });
  return array;
};

const getTotalPrice = (arr) => {
  let totPrice = 0;
  const productsInCart = JSON.parse(localStorage.getItem("itemsOnCart"));
  for (let el of arr) {
    let price = Number(el.price.substring(1));
    totPrice += price * productsInCart[el.name];
  }
  return totPrice;
};

const deleteItem = (event) => {
  const buttonId = event.target;
  const parent = buttonId.parentNode;
  const parentsParent = parent.parentNode;
  parentsParent.remove();
  let productsInCart = JSON.parse(localStorage.getItem("itemsOnCart"));
  delete productsInCart[buttonId.id];
  localStorage.setItem("itemsOnCart", JSON.stringify(productsInCart));
  console.log("done");
  const itemNum = document.querySelector("#itemNum");
  const price = document.querySelector("#price");
  itemNum.innerHTML = totalItems();
  price.innerHTML = `$${getTotalPrice(startPage())}`;
  clearPage()
  showOnCartPage(startPage(),getTotalPrice(startPage()));
};

const clearPage = ()=> {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};
function totalItems() {
  const itemsOnCart = JSON.parse(localStorage.getItem("itemsOnCart"));
  const itemValues = Object.values(itemsOnCart);
  const total = itemValues.reduce((a, b) => a + b, 0);
  return total;
}
const arr = startPage();
const total = getTotalPrice(arr);
showOnCartPage(arr, total);
