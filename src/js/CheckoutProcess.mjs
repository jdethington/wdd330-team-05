import { getLocalStorage } from './utils.mjs';



export default class CheckoutProcess {
    
    constructor(key,outSelector) {

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
    calculateItemSummary () {
         
        let subtotal = 0;
    
        
        this.list.forEach((item)  => {
             
            subtotal += item.FinalPrice;
            totalItems += item.quantity || 1;
            this.itemTotal= subtotal;
            
        
        });  
        const subtotalElement = document.querySelector(`${this.outSelector} #subtotal`);
        subtotalElement.innerText = `$${this.itemTotal.toFixed(2)}`;
 
    }
    calculateOrderTotal () {
         
         this.tax = this.itemTotal * 0.06;
         if(this.list.length > 0) {
            let count = 0;
            this.list.forEach(item => count += item.quantity || 1);

            this.shipping = 10 + (count-1) *2;
         } else {
            this.shipping = 0;
         }

         this.orderTotal = this.tax + this.itemTotal + this.shipping;
         this.displayOrderTotal();

    }

    displayOrderTotal () {
        const shippingElement = document.querySelector(`${this.outSelector} #shipping`);

        shippingElement.innerText = `$${this.shipping.toFixed(2)}`;

        const taxElement = document.querySelector(`${this.outSelector} #tax`);

        taxElement.innerText = `$${this.tax.toFixed(2)}`;

        const totalElement = document.querySelector(`${this.outSelector} #total`);

        totalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
        
        
    }

  

}