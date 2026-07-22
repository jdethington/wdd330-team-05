import {
  renderListWithTemplate,
  getLocalStorage,
  setLocalStorage,
  cartSuperscript,
} from "./utils.mjs";

// The class "ShoppingCart"
export default class ShoppingCart {
  constructor() {
    this.dataSource = getLocalStorage("so-cart") || [];
    this.listElement = document.querySelector(".product-list");
  }

  async init() {
    this.renderCartContents();

    // event listener to remove item on "click"
    this.listElement.addEventListener("click", (event) => {
      if (event.target.classList.contains("cart-card__remove")) {
        const productId = event.target.getAttribute("data-id");
        this.removeFromCart(productId);
      }
    });

    // Event listener for quantity changes
    this.listElement.addEventListener("change", (event) => {
      if (event.target.classList.contains("cart-qty-input")) {
        const productId = event.target.getAttribute("data-id");
        const newQty = parseInt(event.target.value);

        this.updateQuantity(productId, newQty);
      }
    });
  }

  // If items in cart - Displays (Renders) each item.  If cart empty - Display "Cart Empty"
  renderCartContents() {
    const cartItems = getLocalStorage("so-cart") || [];
    // const htmlItems = cartItems.map((item) => cartItemTemplate(item));

    if (cartItems.length === 0) {
      document.querySelector(".product-list").textContent = "Cart empty";
      document.querySelector(".cart-footer").classList.add("hide");
    } else {
      renderListWithTemplate(
        cartItemTemplate,
        this.listElement,
        cartItems,
        "afterbegin",
        true,
      );
      const total = cartItems
        .reduce((sum, item) => sum + item.FinalPrice * (item.quantity || 1), 0)
        .toFixed(2);
      document.querySelector(".cart-total").innerHTML = `Total: $${total}`;
      document.querySelector(".cart-footer").classList.remove("hide");
    }
    cartSuperscript();
  }

  // Removes an item from the cart
  removeFromCart(id) {
    const cartItems = getLocalStorage("so-cart") || [];

    const itemIndex = cartItems.findIndex((item) => item.Id === id);

    if (itemIndex !== -1) {
      cartItems.splice(itemIndex, 1);
      setLocalStorage("so-cart", cartItems);
      this.renderCartContents();
    }
  }

  updateQuantity(id, newQty) {
    const cartItems = getLocalStorage("so-cart") || [];

    const item = cartItems.find((itemX) => itemX.Id === id);
    if (!item) return;

    item.quantity = newQty;

    setLocalStorage("so-cart", cartItems);
    this.renderCartContents();
  }
}

// This is how each "item" in the cart will be displayed (Rendered) on the page
function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="cart-card__remove" data-id="${item.Id}">x</span>
  
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
  <label class="cart-card__quantity"> 
    Quantity: 
    <input 
    type="number"
    min="1"
    value="${item.quantity || 1}"
    class="cart-qty-input"
    data-id="${item.Id}"
    >
  
  </label>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}
