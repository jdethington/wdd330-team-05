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



export function alertMessage(message, scroll = true) {
  // 1. Create alert element
  const alert = document.createElement("div");
  alert.classList.add("alert");

  // 2. Set content (Proper </p> tag & 'X' inside <span>)
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  // 3. Add close button listener
  alert.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN" || e.target.innerText === "X") {
      main.removeChild(this);
    }
  });

  // 4. Select <main> and insert alert at the top
  const main = document.querySelector("main");
  main.prepend(alert);

  // 5. Scroll to top if requested
  if (scroll) {
    window.scrollTo(0, 0);
  }
}