import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

// Calculate totals when Zip loses focus
document.querySelector("#zip").addEventListener("blur", () => {
  order.calculateOrderTotal();
});

// This is what triggers packageItems in CheckoutProcess
document.forms["checkout"].addEventListener("submit", (e) => {
  e.preventDefault();
  order.checkout();
});
