import { getParam, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
// first create an instance of the ExternalServices class.
const dataSource = new ExternalServices();
// then get the element you want the product list to render in
const element = document.querySelector(".product-list");
// then create an instance of the ProductList class and send it the correct information.
const listing = new ProductList(category, dataSource, element);
// finally call the init method to show the products

//Function to display modal
async function initPage() {
  await listing.init();

  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("closeBtn");

  closeBtn.addEventListener("click", () => modal.close());

  const openBtns = document.querySelectorAll(".openBtn");

  openBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const product = listing.products.find((item) => item.Id == productId);

      modalContent.innerHTML = `
        <h2>${product.Name}</h2>
        <img src="${product.Images.PrimarySmall}">
        <p>Color: ${product.Colors[0].ColorName}</p>
        <div>${product.DescriptionHtmlSimple}</div>
        <p><strong>$${product.FinalPrice}</strong></p>
      `;

      modal.showModal();
    });
  });
}

initPage();

// sort selector on product list page
const sortSelect = document.querySelector("#sort-select");

sortSelect.addEventListener("change", (e) => {
  const criteria = e.target.value;
  listing.sortList(criteria);
});
