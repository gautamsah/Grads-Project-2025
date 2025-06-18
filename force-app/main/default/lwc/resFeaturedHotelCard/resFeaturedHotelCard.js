import { LightningElement } from 'lwc';
import hoteldetail from '@salesforce/apex/RES_Utility.getFeatureHotelCards';

export default class ResFeaturedCard extends LightningElement {
    getHotels;
    hasRenderd = false;
    trueValue = true;
    connectedCallback(){
            this.cards = this.template.querySelector('card-container');
            hoteldetail().then(result => {
                this.getHotels = result;
                this.hasRenderd = true;
            })
            .catch(error => {
                console.error('Error fetching test4 names:', error);
            });
        }
}