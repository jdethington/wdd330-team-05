import Alerts from "./alerts.mjs";
import { loadHeaderFooter, cartSuperscript, alertMessage, setLocalStorage, getLocalStorage } from "./utils.mjs";
const alertWaitTime = 1000;

loadHeaderFooter();

setTimeout(alert, alertWaitTime);

function alert() {
  new Alerts();
}

cartSuperscript();
function initNewsletterForm() {
  const form = document.querySelector("#newsletterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = form.querySelector("#newsletterEmail");
    const email = emailInput.value.trim();

    if (!email || !form.checkValidity()) {
      alertMessage("Please enter a valid email address.");
      return;
    }

    const subscribers = getLocalStorage("so-newsletter") || [];
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      setLocalStorage("so-newsletter", subscribers);
    }

    alertMessage(`Thanks for signing up, ${email}!`, false);
    form.reset();
  });
}

initNewsletterForm();