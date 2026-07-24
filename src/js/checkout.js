import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

// 1. Initialize CheckoutProcess
const checkout = new CheckoutProcess("so-cart", ".Summary");
checkout.init();

// 2. Listen for Zip Code entry to calculate Tax, Shipping, & Total
document.querySelector("#zip").addEventListener("blur", () => {
    checkout.calculateOrderTotal();
});

// 3. Handle Form Submission
document.querySelector("#checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Calculate totals first if not already calculated
    checkout.calculateOrderTotal();

    // Call the checkout method and pass the form element!
    checkout.checkout(event.target);
});