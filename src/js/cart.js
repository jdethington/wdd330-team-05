import { getLocalStorage, setLocalStorage, cartSuperscript } from "./utils.mjs"; // Added setLocalStorage

// If items in cart - Displays(Renders) each item.  If cart empty - Display "Cart Empty"
function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
  if (cartItems.length === 0) {
    document.querySelector(".product-list").textContent = "Cart empty";
    document.querySelector(".cart-total").innerHTML = `Total: $${total}`;
    document.querySelector(".cart-footer").classList.add("hide");
  } else {
    document.querySelector(".product-list").innerHTML = htmlItems.join("");
    document.querySelector(".cart-total").innerHTML = `Total: $${total}`;
    document.querySelector(".cart-footer").classList.remove("hide");
  }
  cartSuperscript();
}

// This is how each "item" in the cart will be displayed(Rendered) on the page
function cartItemTemplate(item) {
  const newItem = `
  <li class="cart-card divider">
    <span class="cart-card__remove" data-id="${item.Id}">X</span>
    <a href="#" class="cart-card__image">
      <img
        src="${item.Images.PrimaryMedium}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;

  return newItem;
}

// Removes an item from the cart
function removeFromCart(id) {
  const cartItems = getLocalStorage("so-cart") || [];

  const itemIndex = cartItems.findIndex((item) => item.Id === id);

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}
// event listener to remove item on "click"
document.querySelector(".product-list").addEventListener("click", (event) => {
  if (event.target.classList.contains("cart-card__remove")) {
    const productId = event.target.getAttribute("data-id");
    removeFromCart(productId);
  }
});

// Calls the function
renderCartContents();