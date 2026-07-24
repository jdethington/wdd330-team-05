// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  // console.log(JSON.parse(localStorage.getItem(key)));
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
// ====================================================
// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  const htmlStrings = list.map(templateFn);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// =========================================================
// adding a superscript over the backpack with the number of items in the cart
export function cartSuperscript() {
  const cartItems = getLocalStorage("so-cart") || [];
  let superscript = 0;
  if (Array.isArray(cartItems)) {
    cartItems.forEach((item) => {
      superscript +=
        item && typeof item.quantity === "number" ? item.quantity : 1;
    });
  }
  const badge = document.querySelector(".cart-count");
  if (badge) {
    if (superscript > 0) {
      badge.innerHTML = superscript;
      badge.classList.remove("hide");
    } else {
      badge.classList.add("hide");
    }
  }
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  // if clear is true we need to clear out the contents of the parent.
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.querySelector("#main-header");

  renderWithTemplate(headerTemplate, headerElement);

  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(footerTemplate, footerElement);
  cartSuperscript();
}
// Returns a number in US currency format "$12.34" "$1,234.56"
export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function alertMessage(message, scroll = true, duration = 3000) {
  // create element to hold the alert
  const alert = document.createElement("div");
  // add a class to style the alert
  alert.classList.add("alert");
  alert.classList.add("form-alert");
  // set the contents. You should have a message and an X or something the user can click on to remove
  alert.innerHTML = `<p class="alert form-alert">${message}</p><span class="delete-button">X</span>`;
  // add a listener to the alert to see if they clicked on the X
  // if they did then remove the child
  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      // how can you tell if they clicked on the X or on something else?  hint: check out e.target.tagName or e.target.innerText
      main.removeChild(this);
    }
  });
  // add the alert to the top of main
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  // you may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);

  setTimeout(() => {
    main.removeChild(alert);
  }, duration);
}
