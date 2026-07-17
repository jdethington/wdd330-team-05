import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alerts from "./alerts.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const alertWaitTime = 2000;

loadHeaderFooter();

setTimeout(alert, alertWaitTime);

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");

const productList = new ProductList("tents", dataSource, element);

productList.init();

function alert() {
  new Alerts();
}
