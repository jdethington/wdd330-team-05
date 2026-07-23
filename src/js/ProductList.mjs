import { renderListWithTemplate } from "./utils.mjs";

import { getDiscountInfo } from "./ProductDetails.mjs";

// The class "ProductList"
export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.products = [];
    }

    async init() {
        const list = await this.dataSource.getData(this.category);
        this.products = list; // make a copy so we can use it for sorting
        this.renderList(list);

        const titleElement = document.querySelector(".title");
        if (titleElement) {
            titleElement.textContent = formatCategory(this.category);
        }
    }

    renderList(list) {
        // const htmlStrings = list.map(productCardTemplate);
        // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
        renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
    }

    sortList(criteria) {
        const sorted = [...this.products].sort((a, b) => {
            if (criteria === "price") {
                return a.FinalPrice - b.FinalPrice;
            }
            else {
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

    
    return `
        <li class="product-card">

        <a href="/product_pages/index.html?product=${id}">
            <img src="${image}" alt="${product.Name}">
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <p>${product.NameWithoutBrand}</p>
            <p class="product-card__price">$${product.FinalPrice}</p>
            </a>
            </li>
        `;
}
// <h2 class="card__name">${product.DescriptionHtmlSimple}</h2>
