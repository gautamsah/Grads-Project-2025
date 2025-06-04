import { LightningElement } from 'lwc';

export default class ResPriceFilter extends LightningElement {
    price = this.querySelector('input').value;
    pricehandler(){
        this.dispatchEvent(
            new CustomEvent('pricechange',{
                detail: this.price
            })
        ) 
    }
}