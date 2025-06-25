import { LightningElement, wire } from 'lwc';
import hoteldetail from '@salesforce/apex/RES_Utility.getRatingHotelCards';

export default class ResHotelCard extends LightningElement{
    getHotels;
    hasRenderd = false;
    trueValue = true;
    connectedCallback(){
        hoteldetail().then(result => {
            this.getHotels = result;
            this.hasRenderd = true;
        })
        .catch(error => {
            console.error('Error fetching test4 names:', error);
        });
    }
}