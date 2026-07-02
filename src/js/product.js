import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // get the current cart contents, or start with an empty cart if nothing is there yet
  let cart = getLocalStorage("so-cart");
  if (!Array.isArray(cart)) {
    cart = [];
  }
  // add the new product to our array
  cart.push(product);

  // save the updated array back to local storage
  setLocalStorage("so-cart", cart);
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
