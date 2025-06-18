import { LightningElement } from 'lwc';
import hoteldetail from '@salesforce/apex/RES_Utility.getFeatureHotelCards';


export default class ResFeaturedCard extends LightningElement {

    getHotels;
       
        connectedCallback(){
            hoteldetail().then(result => {
                this.getHotels = result;
                
                console.log("Data from back", result);
            })
            .catch(error => {
                console.error('Error fetching test4 names:', error);
            });
    
        }
}