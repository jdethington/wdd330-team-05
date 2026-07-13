export default class Alerts {
    constructor() {
        this.loadAlerts();
    }
    
    async loadAlerts() {
        const response = await fetch("../json/alerts.json");
        const alerts = await response.json();
        if (alerts.length > 0) {
        this.createAlertSection(alerts);            
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
    
    // Prepend to main element (or body as fallback)
    const main = document.querySelector("main");
      main.prepend(section);
  }
}
