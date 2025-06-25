import { LightningElement } from 'lwc';

export default class ResReviewFilter extends LightningElement {
    handleChange(event){
        this.dispatchEvent(
            new CustomEvent('changeevent',{
                    detail: event.target.value
            })
        );     
        }
}