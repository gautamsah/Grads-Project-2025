import { api, LightningElement } from 'lwc';
import relatedHotel from '@salesforce/apex/RES_Utility.getRelatedHotels';

export default class ResRelatedHotel extends LightningElement {

    hasRenderd = false;
    relatedHotels = [];
    @api hotelName;
    @api cityName;

    connectedCallback(){
        console.log('Hotel Name:', this.hotelName);
        console.log('Hotel City:', this.cityName);
        relatedHotel({hotelName : this.hotelName, cityName : this.cityName})
        .then(result =>{
            this.relatedHotels = result;
            this.hasRenderd = true;
            console.log('Got records:',this.relatedHotels);
        }).catch(error =>{
            console.log('Error getting related hotels!', error.message);
        })
    }
}