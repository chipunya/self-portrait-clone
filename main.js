"use strict";
import { getData } from "./data.js";
const data = getData();
// import { saveClickedItem } from "./open-product-page.js";

//VARIABLES
const main = document.querySelector(".main");
const sortHighLow = document.querySelector("#sort-high-low");
const sortLowHigh = document.querySelector("#sort-low-high");
const sortAtoZ = document.querySelector("#sort-AtoZ");
const sortZtoA = document.querySelector("#sort-ZtoA");
const viewAllBtn = document.querySelector("#view-all");

const searchBtn = document.getElementById("search-btn");
const searchWrap = document.querySelector(".search-wrap");
const searchContainer = document.querySelector("#search-big-container");
const searchResultsContainter = document.querySelector(".search-results");

const searchBar = document.querySelector("#search-bar");
const searchLinksContainer = document.querySelector(".search-links");
const searchLinksElements = document.querySelectorAll(".search-link");

//VARIABLES for FILTERING ---erol
// Style
const longSleeve = document.querySelector("#long-sleeve");
const shortSleeve = document.querySelector("#short-sleeve");
const sleeveless = document.querySelector("#sleeveless");
const offShoulder = document.querySelector("#off-shoulder");
// Colors
const black = document.querySelector("#black");
const white = document.querySelector("#white");
const pink = document.querySelector("#pink");
const cream = document.querySelector("#cream");
const red = document.querySelector("#red");
const orange = document.querySelector("#orange");
const brown = document.querySelector("#brown");
const green = document.querySelector("#green");
const blue = document.querySelector("#blue");
const grey = document.querySelector("#grey");
const lilac = document.querySelector("#lilac");
const yellow = document.querySelector("#yellow");
// Length
const mini = document.querySelector("#mini");
const midi = document.querySelector("#midi");
const maxi = document.querySelector("#maxi");

//FILTER BY STYLE -- Erol
//long-sleeve
const filterLongSleeve = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.style === "long-sleeve");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
longSleeve.addEventListener("click", filterLongSleeve);
// short-sleeve
const filterShortSleeve = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.style === "short-sleeve");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
shortSleeve.addEventListener("click", filterShortSleeve);
// sleeveless
const filterSleeveless = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.style === "sleeveless");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
sleeveless.addEventListener("click", filterSleeveless);
// off-shoulder
const filterOffShoulder = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.style === "off-shoulder");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
offShoulder.addEventListener("click", filterOffShoulder);
//FILTER by color
// black
const filterBlack = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "black");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
black.addEventListener("click", filterBlack);
// white
const filterWhite = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "white");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
white.addEventListener("click", filterWhite);
//pink
const filterPink = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "pink");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
pink.addEventListener("click", filterPink);
// cream
const filterCream = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "cream");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
cream.addEventListener("click", filterCream);
// red
const filterRed = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "red");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
red.addEventListener("click", filterRed);
// orange
const filterOrange = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "orange");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
orange.addEventListener("click", filterOrange);
// brown
const filterBrown = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "brown");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
brown.addEventListener("click", filterBrown);
// green
const filterGreen = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "green");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
green.addEventListener("click", filterGreen);
// blue
const filterBlue = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "blue");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
blue.addEventListener("click", filterBlue);
// grey
const filterGrey = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "grey");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
grey.addEventListener("click", filterGrey);
// lilac
const filterLilac = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "lilac");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
lilac.addEventListener("click", filterLilac);
// yellow
const filterYellow = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.color === "yellow");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
yellow.addEventListener("click", filterYellow);
//FILTER BY LENGTH
// mini
const filterMini = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.length === "mini");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
mini.addEventListener("click", filterMini);
// midi
const filterMidi = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.length === "midi");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
midi.addEventListener("click", filterMidi);
// maxi
const filterMaxi = () => {
  clearMain();
  const filteredArray = data.filter((el) => el.length === "maxi");
  // console.log(filteredArray);
  displayProducts(filteredArray);
};
maxi.addEventListener("click", filterMaxi);

//variables for displaying search result num
const searchResultNum = document.createElement("p");
searchResultNum.classList.add("search-result-number");

//-----------HELPER FUNCTIONS

//show total number of items on cart
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
//Function to display all products
const displayProducts = function (arr) {
  arr.forEach((el) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.innerHTML = `
      <div class="product-img-container">
        <img class="product-img1" src=${el.image} alt="">
        <img class="product-img1" src=${el.image2} alt="">
      </div>
      <div class="product-info">
        <p class="product-name">${el.name}</p>
        <p class="product-detail">${el.style}, ${el.length}</p>
        <p class="product-price">${el.price}</p>
      </div>`;
    main.appendChild(cardDiv);
  });
  // totalItems();
};
//calling this function to display all dresses in the very beginning
displayProducts(data);

//function to clear the main from all products
const clearMain = function () {
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
};

//function to clear the search results container from all products
const clearResultsContainer = function () {
  while (searchResultsContainter.firstChild) {
    searchResultsContainter.removeChild(searchResultsContainter.firstChild);
  }
};

//function to display search bar
const displaySearchBar = () => {
  searchWrap.style.display = "flex";
};
searchBtn.addEventListener("click", displaySearchBar);

//function to hide search input and to clear search results
document.onclick = function (e) {
  if (
    e.target.id != searchContainer.id &&
    e.target.id !== searchBtn.id &&
    e.target.id !== searchBar.id
  )
    searchWrap.style.display = "none";
  searchBar.value = "";
  searchResultNum.style.display = "none";
  clearResultsContainer();
};

//function to display an error message if there are no results
const showErrorMessage = function () {
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");
  errorMessage.innerText = "No results found. Sorry!";
  searchResultsContainter.appendChild(errorMessage);
  setTimeout(() => searchResultsContainter.removeChild(errorMessage), 3000);
};

//Function to display search results
const displaySearchResults = function (arr, searchValue) {
  if (arr.length > 0) {
    arr.forEach((el) => {
      const searchCard = document.createElement("div");
      searchCard.classList.add("search-card");
      searchCard.innerHTML = `
        <div class="search-img-container">
            <img class="search-image" src=${el.image} alt="">
        </div>
        <div class="search-card-info">
          <p class="search-card-name">${el.name}</p>
          <p class="search-card-price">${el.price}</p>
        </div>`;
      searchResultsContainter.appendChild(searchCard);
    });
    searchResultNum.innerText = `${arr.length} Result(s) found for '${searchValue}'`;
    searchLinksContainer.appendChild(searchResultNum);
    searchResultNum.style.display = "block";
  }
  if (arr.length == 0) {
    showErrorMessage();
  }
};

//

//----------------MAIN FUNCTIONS

//////Searching by input value in search bar
function searchProducts(e) {
  clearResultsContainer();

  //creating a new array, which will hold products meeting the search input
  let filteredArray = [];
  // console.log(input);
  const searchInput = e.target.value.trim().toLowerCase().split(" ");
  console.log(searchInput);
  //looping through each element(dress) of the Data array and adding matching dresses to the new array
  if (searchInput.length > 0) {
    filteredArray = data.filter((el) => {
      return (
        el.name.toLowerCase().includes(searchInput) ||
        el.color.includes(searchInput) ||
        el.style.includes(searchInput) ||
        el.length.includes(searchInput)
      );
    });
    while (searchLinksContainer.firstChild) {
      searchLinksContainer.removeChild(searchLinksContainer.firstChild);
    }
    // displaying the objs(dresses) contained in the new array (objs containing the search input)
    displaySearchResults(filteredArray, searchInput);
  } else {
    clearResultsContainer();
    showErrorMessage();
  }
}
searchBar.addEventListener("change", searchProducts);

////////SORTING from HIGH TO LOW PRICE
const displayHighToLowPrice = function (arr) {
  clearMain();
  const newArr = data.slice(0).sort(function (a, b) {
    return b.price.substring(1) - a.price.substring(1);
  });
  return displayProducts(newArr);
};
sortHighLow.addEventListener("click", displayHighToLowPrice);

//////SORTING from LOW TO HIGH PRICE
const displayLowToHighPrice = function (arr) {
  clearMain();
  const newArr = data.slice(0).sort(function (a, b) {
    return a.price.substring(1) - b.price.substring(1);
  });
  return displayProducts(newArr);
};
sortLowHigh.addEventListener("click", displayLowToHighPrice);

//////SORTING by NAME (A to Z)
const displayAtoZ = function (arr) {
  clearMain();
  const newArr = data.slice(0).sort(function (a, b) {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();
    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
  });
  return displayProducts(newArr);
};
sortAtoZ.addEventListener("click", displayAtoZ);

//////SORTING by NAME (Z to A)
const displayZtoA = function (arr) {
  clearMain();
  const newArr = data.slice(0).sort(function (a, b) {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();
    return nameA < nameB ? 1 : nameA > nameB ? -1 : 0;
  });
  return displayProducts(newArr);
};
sortZtoA.addEventListener("click", displayZtoA);

//////VIEW ALL
// Function to view all products
const viewAll = function (arr) {
  clearMain();
  displayProducts(data);
};
viewAllBtn.addEventListener("click", viewAll);

//EVENT LISTENER FOR CARDS

const saveClickedItem = (e) => {
  const imgSrc = e.target.src;
  console.log(e.target);
  const newArr = data.filter((el) => el.image2 === imgSrc);
  //saved the new ARR in local storage
  localStorage.setItem("clickedItem", JSON.stringify(newArr));
  console.log(newArr);
  const openNewPage = window.open("product-page.html", "_self");
};
main.addEventListener("click", saveClickedItem);

//FILTER BY STYLE

//FILTER BY LENGTH

//FILTER by color - red
