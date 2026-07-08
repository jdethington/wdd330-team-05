import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource, detailsTarget = '#product-details') {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
    this.detailsTarget = detailsTarget;
    this.cartKey = 'cart';
  }

  async init() {
    // fetch the product details before rendering
    this.product = await this.dataSource.findProductById(this.productId);

    // render the product details HTML
    this.renderProductDetails();

    // wire the Add to Cart button after rendering
    const addButton = document.getElementById('addToCart');
    if (addButton) {
      addButton.addEventListener('click', this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    const cart = JSON.parse(localStorage.getItem(this.cartKey)) || [];
    cart.push(this.product);
    setLocalStorage(this.cartKey, cart);
  }

  renderProductDetails() {
    const container = document.querySelector(this.detailsTarget);
    if (!container || !this.product) return;

    container.innerHTML = `
      <article class="product-details">
        <img src="${this.product.image}" alt="${this.product.name}" class="product-details__image" />
        <div class="product-details__info">
          <h1 class="product-details__title">${this.product.name}</h1>
          <p class="product-details__description">${this.product.description || ''}</p>
          <p class="product-details__price">$${Number(this.product.price).toFixed(2)}</p>
          <button id="addToCart" class="product-details__button">Add to Cart</button>
        </div>
      </article>
    `;
  }
}