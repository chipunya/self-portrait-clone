"use strict";
import { getData } from "./data.js";
const data = getData();

//VARIABLES
const main = document.querySelector(".product-container");

const displayItem = () => {
  const item = JSON.parse(localStorage.getItem("clickedItem"));
  // console.log(item[0].image);
  main.innerHTML = `
    <div class="product-main">
    <div class="img-container">
      <img src="${item[0].image}"/>
    </div>
    <div class="product-info">
      <div class="product-general-info">
        <h1>${item[0].name}</h1>
        <p>${item[0].price}</p>
      </div>
      <div class="product-details">
        <div class="product-description">
          <div>
            <p>${item[0].color}</p>
          </div>
          <div class="div">
            <p>${item[0].style}</p>
          </div>
          <div>
            <p>${item[0].length}</p>
          </div>
          <div>
            <p>US Size</p>
          </div>
          <div class="add-button" id='${item[0].name}'>
            <a>ADD TO CART</a>
          </div>
        </div>
        <div class="product-delivery-info">
          <p>We expect to dispatch this item within 1-2 working days.</p>
          <p>All orders sent on a priority delivery service.</p>
          <a href="">Find out more — Contact Us</a>
          <a href="">See details</a>
        </div>
      </div>
    </div>
  </div>`;
  // totalItems();
};
displayItem();

function totalItems() {
  const itemsOnCart = JSON.parse(localStorage.getItem("itemsOnCart"));
  const spanForCart = document.querySelector("#qtyOnCart");

  if (itemsOnCart !== null) {
    const itemValues = Object.values(itemsOnCart);
    const total = itemValues.reduce((a, b) => a + b, 0);
    spanForCart.innerHTML = total;
  } else {
    spanForCart.innerHTML = 0;
  }
}
totalItems();

const addToCart = () => {
  const itemsOnCart = JSON.parse(localStorage.getItem("itemsOnCart"));
  const itemClicked = JSON.parse(localStorage.getItem("clickedItem"));
  let id = itemClicked[0].name;
  if (itemsOnCart) {
    const keys = Object.keys(itemsOnCart);
    if (keys.includes(id)) {
      console.log(itemsOnCart);
      let quantity = itemsOnCart[id] + 1;
      const items = {
        ...itemsOnCart,
        [id]: quantity,
      };
      localStorage.setItem("itemsOnCart", JSON.stringify(items));
    } else {
      const obj = {
        ...itemsOnCart,
        [id]: 1,
      };
      localStorage.setItem("itemsOnCart", JSON.stringify(obj));
    }
  } else {
    const obj = {
      [id]: 1,
    };
    localStorage.setItem("itemsOnCart", JSON.stringify(obj));
  }
  // alert("Successfully added to your cart!");
  totalItems();
};

const addEvent = () => {
  const item = JSON.parse(localStorage.getItem("clickedItem"));
  const btnAddToCart = document.getElementById(`${item[0].name}`);
  btnAddToCart.addEventListener("click", addToCart);
};

addEvent();
