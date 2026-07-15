import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alerts from "./alerts.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

new Alerts();

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");

const productList = new ProductList("tents", dataSource, element);

productList.init();
