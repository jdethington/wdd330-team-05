import { renderListWithTemplate, getDiscountInfo } from "./utils.mjs";

// import { getDiscountInfo } from "./ProductDetails.mjs";

// The class "ProductList"
export default class ProductList {
  constructor(category, dataSource, listElement, searchQuery = "") {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
    this.searchQuery = searchQuery;
    this.products = [];
  }

  async init() {
    let list = [];

    // 1. Fetch from all categories if searching globally, or from single category
    if (this.searchQuery && !this.category) {
      const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
      const results = await Promise.all(
        categories.map((cat) => this.dataSource.getData(cat)),
      );
      list = results.flat();
    } else {
      const categoryToFetch = this.category || "tents";
      list = await this.dataSource.getData(categoryToFetch);
    }

    // 2. Safe filtering using optional chaining
    if (this.searchQuery) {
      const term = this.searchQuery.toLowerCase().trim();
      list = list.filter((product) => {
        const name = product.Name?.toLowerCase() || "";
        const nameWithoutBrand = product.NameWithoutBrand?.toLowerCase() || "";
        const brandName =
          (typeof product.Brand === "string"
            ? product.Brand
            : product.Brand?.Name
          )?.toLowerCase() || "";

        return (
          name.includes(term) ||
          nameWithoutBrand.includes(term) ||
          brandName.includes(term)
        );
      });
    }

    this.products = list;
    this.renderList(list);

    const titleElement = document.querySelector(".title");
    if (titleElement) {
      if (this.searchQuery) {
        titleElement.textContent = `Search results for "${this.searchQuery}"`;
      } else if (this.category) {
        titleElement.textContent = formatCategory(this.category);
      }
    }
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }

  sortList(criteria) {
    const sorted = [...this.products].sort((a, b) => {
      if (criteria === "price") {
        return a.FinalPrice - b.FinalPrice;
      } else {
        return a.NameWithoutBrand.localeCompare(b.NameWithoutBrand);
      }
    });
    this.listElement.innerHTML = "";
    this.renderList(sorted);
  }
}

function formatCategory(category) {
  if (!category) return "Products";

  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Template used to display product
function productCardTemplate(product) {
  const image = product.Images?.PrimaryMedium || product.Image;
  const id = product.Id;
  const discountInfo = getDiscountInfo(product);
  const discountFlag = discountInfo
    ? `
      <div class="sale flag">
        SALE
      </div>
      `
    : "";
  if (discountInfo) {
    return `
        <li class="product-card">
        ${discountFlag}
        <a href="/product_pages/index.html?product=${id}">
            <img src="${image}" alt="${product.Name}">
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <p>${product.NameWithoutBrand}</p>
            <p class="product-card__price">$${product.FinalPrice}</p>
            </a>
            <button type="button" class="openBtn" data-product-id="${id}">Quick View</button>
            </li>
        `;
  } else {
    return `
        <li class="product-card">
        <a href="/product_pages/index.html?product=${id}">
            <img src="${image}" alt="${product.Name}">
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <p>${product.NameWithoutBrand}</p>
            <p class="product-card__price">$${product.FinalPrice}</p>
            </a>
            <button type="button" class="openBtn" data-product-id="${id}">Quick View</button>
            </li>
        `;
  }
}

// <h2 class="card__name">${product.DescriptionHtmlSimple}</h2>
