import Alerts from "./alerts.mjs";
import { loadHeaderFooter, cartSuperscript } from "./utils.mjs";

const alertWaitTime = 1000;

loadHeaderFooter();

setTimeout(alert, alertWaitTime);

function alert() {
  new Alerts();
}

cartSuperscript();
