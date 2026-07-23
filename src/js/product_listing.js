import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
// first create an instance of the ExternalServices class.
const dataSource = new ExternalServices();
// then get the element you want the product list to render in
const element = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const listing = new ProductList(category, dataSource, element);
// finally call the init method to show the products
listing.init();

// sort selector on product list page
const sortSelect = document.querySelector("#sort-select");

sortSelect.addEventListener("change", (e) => {
    const criteria = e.target.value;
    listing.sortList(criteria);
});

