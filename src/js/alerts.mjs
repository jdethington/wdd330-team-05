export default class Alerts {
    constructor() {
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
        this.createAlertSection(alerts);
      }
    } catch (error){
        console.error("There was a problem fetching the data: ", error)
    }
  }

  createAlertSection(alerts) {
  const section = document.createElement("section");
  section.className = "alert-list";
  
  alerts.forEach(alert => {
    const p = document.createElement("p");
    p.textContent = alert.message;
    p.style.backgroundColor = alert.background;
    p.style.color = alert.color;
    section.appendChild(p);
  });
  
  // Prepend to main element
  const main = document.querySelector("main");
    main.prepend(section);
  }
}
