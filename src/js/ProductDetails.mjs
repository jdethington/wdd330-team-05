import { getLocalStorage,setLocalStorage } from './utils.mjs';

export function getDiscountInfo(product) {
  if (!product) return null;

  const suggestedRetailPrice = Number(product.SuggestedRetailPrice);
  const finalPrice = Number(product.FinalPrice);

  if (Number.isNaN(suggestedRetailPrice) || Number.isNaN(finalPrice)) return null;
  if (finalPrice >= suggestedRetailPrice) return null;

  const amount = Number((suggestedRetailPrice - finalPrice).toFixed(2));

  return {
    amount,
    message: `Save $${amount.toFixed(2)}!`
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

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

  const discountInfo = getDiscountInfo(product);
  const productPrice = document.getElementById("productPrice");
  const originalPrice = document.getElementById("productOriginalPrice");
  const discountIndicator = document.getElementById("discountIndicator");

  productPrice.textContent = formatCurrency(product.FinalPrice);

  if (discountInfo) {
    originalPrice.textContent = formatCurrency(product.SuggestedRetailPrice);
    originalPrice.classList.remove("hidden");
    discountIndicator.textContent = discountInfo.message;
    discountIndicator.classList.remove("hidden");
  } else {
    originalPrice.textContent = "";
    originalPrice.classList.add("hidden");
    discountIndicator.textContent = "";
    discountIndicator.classList.add("hidden");
  }

  document.getElementById("productColor").textContent = product.Colors?.[0]?.ColorName || "N/A";
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}

