// import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class Alerts {
  constructor() {
    // this.showAlerts = getLocalStorage("so-alert") || [];
    this.loadAlerts();
  }

  async loadAlerts() {
    try {
      const response = await fetch("../json/alerts.json");
      if (!response.ok) {
        throw new Error(`Error! Status ${response.status}`);
      }
      const alerts = await response.json();
      if (alerts.length > 0) {
        // if (this.showAlerts.length === 0) {
        //   setLocalStorage("so-alert", alerts);
        // }
        this.displayAlerts(alerts);
      }
    } catch (error) {
      console.error("There was a problem fetching the data: ", error);
    }
  }

  displayAlerts(alerts) {
    const section = document.createElement("section");
    section.className = "alert-list";

    alerts.forEach((alert) => {
      const alertMessage = document.createElement("div");
      alertMessage.textContent = alert.message;
      alertMessage.style.backgroundColor = alert.background;
      alertMessage.style.color = alert.color;
      alertMessage.classList.add("alert");

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.ariaLabel = "Remove Alert";

      deleteButton.classList.add("delete-button");
      alertMessage.append(deleteButton);
      section.append(alertMessage);

      deleteButton.addEventListener("click", function () {
        section.removeChild(alertMessage);
      });
    });
    const main = document.querySelector("main");
    main.prepend(section);
  }
}
