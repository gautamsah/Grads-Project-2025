import { LightningElement } from 'lwc';

export default class ResSearchFilter extends LightningElement {
    handleKeyChange(event){
        console.log(event.target.value);
        this.dispatchEvent(
            new CustomEvent('keychange',{
                detail: event.target.value
            }
        ));
    }
}