import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

const cart = new ShoppingCart();
cart.init();
if (cart.total > 0) {
  const list = document.querySelectorAll(".cart-checkout");
  list.forEach((item) => {
    item.classList.remove("hide");
  });
}
