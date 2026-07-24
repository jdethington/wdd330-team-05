import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

const externalServices = new ExternalServices ();

export default class CheckoutProcess {
    constructor(key, outSelector) {
        this.key = key;
        this.outSelector = outSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSummary() {
        let subtotal = 0;
        let totalItems = 0;

        this.list.forEach((item) => {
            subtotal += item.FinalPrice;
            totalItems += item.quantity || 1;
        });

        this.itemTotal = subtotal;

        // Display item subtotal
        const subtotalElement = document.querySelector(`${this.outSelector} #subtotal`);
        if (subtotalElement) {
            subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
        }
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;

        if (this.list.length > 0) {
            let count = 0;
            this.list.forEach((item) => (count += item.quantity || 1));
            this.shipping = 10 + (count - 1) * 2;
        } else {
            this.shipping = 0;
        }

        this.orderTotal = this.tax + this.itemTotal + this.shipping;
        this.displayOrderTotal();
    }

    displayOrderTotal() {
        const shippingElement = document.querySelector(`${this.outSelector} #shipping`);
        const taxElement = document.querySelector(`${this.outSelector} #tax`);
        const totalElement = document.querySelector(`${this.outSelector} #orderTotal`);

        if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
        if (taxElement) taxElement.innerText = `$${this.tax.toFixed(2)}`;
        if (totalElement) totalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
    }

    packageItems(items) {
        return items.map((item) => ({
            id: item.Id,
            name: item.Name,
            price: item.FinalPrice,
            quantity: item.quantity || 1
        }));
    }
    async checkout(form) {
    // 1. Convert form data to a JSON object
    const formData = new FormData(form);
    const convertedJSON = {};

    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });

    // 2. Attach order metadata required by the server
    convertedJSON.orderDate = new Date().toISOString();
    convertedJSON.items = this.packageItems(this.list);
    convertedJSON.orderTotal = this.orderTotal.toFixed(2);
    convertedJSON.shipping = this.shipping;
    convertedJSON.tax = this.tax.toFixed(2);

    // 3. Send payload to backend server
    try {
        const response = await externalServices.checkout(convertedJSON);
        console.log("Order submitted successfully:", response);
        return response;
    } catch (err) {
        console.error("Order submission failed:", err);
    }
}
}