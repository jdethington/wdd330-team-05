import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

// 1. Read both URL query parameters
const category = getParam("category");
const searchQuery = getParam("search");

const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");

// 2. Pass category AND searchQuery into ProductList
const listing = new ProductList(category, dataSource, element, searchQuery);

async function initPage() {
  await listing.init();

  // Update title based on search or category
  const titleElement = document.querySelector(".title");
  if (titleElement) {
    if (searchQuery) {
      titleElement.textContent = `Search results for "${searchQuery}"`;
    } else if (category) {
      titleElement.textContent = category;
    } else {
      titleElement.textContent = "All Products";
    }
  }

  // Modal event listeners
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("closeBtn");

  if (closeBtn) closeBtn.addEventListener("click", () => modal.close());

  const openBtns = document.querySelectorAll(".openBtn");
  openBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const product = listing.products.find((item) => item.Id == productId);

      if (product) {
        modalContent.innerHTML = `
          <h2>${product.Name}</h2>
          <img src="${product.Images?.PrimarySmall || ""}" alt="${product.Name}">
          <p>Color: ${product.Colors?.[0]?.ColorName || "N/A"}</p>
          <div>${product.DescriptionHtmlSimple || ""}</div>
          <p><strong>$${product.FinalPrice}</strong></p>
        `;
        modal.showModal();
      }
    });
  });
}

initPage();

// Sort selector listener
const sortSelect = document.querySelector("#sort-select");
if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    listing.sortList(e.target.value);
  });
}
