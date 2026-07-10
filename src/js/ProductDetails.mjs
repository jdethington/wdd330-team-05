import { getLocalStorage,setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource, detailsTarget = '#product-details') {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
   
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
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

  function productDetailsTemplate(product) {
  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = product.FinalPrice;
  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}

