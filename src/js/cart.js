import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

const cart = new ShoppingCart();
cart.init();

document.querySelector("#checkout-button")?.addEventListener("click", () => {
  window.location.href = "/checkout/index.html";
});
