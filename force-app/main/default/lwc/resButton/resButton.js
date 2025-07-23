import { api, LightningElement } from 'lwc';

export default class ResButton extends LightningElement {

    @api variant;
    @api buttonLabel;

    handleChange(event) {
        this.dispatchEvent(new CustomEvent('press', {}));
    }
}