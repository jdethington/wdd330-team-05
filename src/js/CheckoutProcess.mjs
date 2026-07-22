// import { getLocalStorage, formatCurrency } from "./utils.mjs";

// class Checkout {
//   constructor() {
//     this.dataSource = getLocalStorage("so-cart") || [];
//     this.cartPrice();
//   }

//   cartPrice() {
//     const subTotal = this.dataSource
//       .reduce((sum, item) => sum + item.FinalPrice * (item.quantity || 1), 0)
//       .toFixed(2);
//     const tax = subTotal * 0.06;
//     const shipping = 10 + 2 * (subTotal.length - 1);
//     const total = subTotal + tax + shipping;
//     document.querySelector("#subtotal").innerHTML =
//       `${formatCurrency(subTotal)}`;
//     document.querySelector("#tax").innerHTML = `${formatCurrency(tax)}`;
//     document.querySelector("#shipping").innerHTML =
//       `${formatCurrency(shipping)}`;
//     document.querySelector("#total").innerHTML = `${formatCurrency(total)}`;
//   }
// }

import { getLocalStorage, formatCurrency } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: item.quantity,
    };
  });
  console.log(simplifiedItems);
  return simplifiedItems;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemsCount = 0; // Total items in cart
    this.itemTotal = 0; // Subtotal cost of items in cart
    this.shipping = 0; // Shipping cost
    this.tax = 0; // tax to be collected
    this.orderTotal = 0; // subtotal + tax + shipping
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total amount of the items in the cart, and the number of items.
    // Calculate the total Items in cart
    const itemNumElement = document.querySelector(
      this.outputSelector + " #num-items",
    ); // Total Items in cart
    // let totalItems = 0;
    this.list.forEach((item) => {
      this.itemsCount +=
        item && typeof item.quantity === "number" ? item.quantity : 1;
    });

    // calculate the subtotal price of all items in cart
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal",
    ); // SubTotal Price
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0,
    );
    // const amounts = this.list.map((item) => item.FinalPrice);
    // this.itemTotal = amounts.reduce((sum, item) => sum + item);

    itemNumElement.innerText = this.itemsCount;
    summaryElement.innerText = `${formatCurrency(this.itemTotal)}`;
  }

  calculateOrderTotal() {
    // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (this.itemsCount - 1) * 2;
    this.orderTotal =
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping);
    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(
      `${this.outputSelector} #orderTotal`,
    );

    tax.innerText = `${formatCurrency(this.tax)}`;
    shipping.innerText = `${formatCurrency(this.shipping)}`;
    orderTotal.innerText = `${formatCurrency(this.orderTotal)}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];
    const order = formDataToJSON(formElement);

    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal;
    order.tax = this.tax;
    order.shipping = this.shipping;
    order.items = packageItems(this.list);
    console.log(order);

    try {
      const response = await services.checkout(order);
      console.log(response);
      if (response) {
        localStorage.removeItem("so-cart");
        window.location.href = "success.html";
      }
    } catch (err) {
      console.log(err);
    }
  }
}
