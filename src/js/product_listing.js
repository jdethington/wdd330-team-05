import {  getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// loadHeaderFooter();

const category = getParam("category");
// first create an instance of the ProductData class.
const dataSource = new ProductData();
// then get the element you want the product list to render in
const element = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const listing = new ProductList(category, dataSource, element);
// finally call the init method to show the products
listing.init();


// import ProductData from "./ProductData.mjs";
// import ProductList from "./ProductList.mjs";

// const dataSource = new ProductData("tents");
// const element = document.querySelector(".product-list");

// const productList = new ProductList("tents", dataSource, element);

// productList.init();
