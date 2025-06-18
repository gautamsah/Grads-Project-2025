import { api, LightningElement } from 'lwc';
import relatedHotel from '@salesforce/apex/RES_Utility.getRelatedHotels';

export default class ResRelatedHotel extends LightningElement {

    hasRenderd = false;
    trueValue = true;
    relatedHotels = [];
    @api hotelName;
    @api cityName;

    connectedCallback(){
        relatedHotel({hotelName : this.hotelName, cityName : this.cityName})
        .then(result =>{
            this.relatedHotels = result;
            this.hasRenderd = true;
        }).catch(error =>{
            console.log('Error getting related hotels!', error.message);
        })
    }

    get hasRelatedHotels() {
        return this.relatedHotels && this.relatedHotels.length > 0;
    }
}