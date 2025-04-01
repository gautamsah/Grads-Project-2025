import { LightningElement } from 'lwc';

import hoteldetail from '@salesforce/apex/RES_Utility.getRatingHotelCards';

export default class ResHotelCard extends LightningElement{
    getHotels;
    isDataLoaded = false;

    hasRenderd = false;
    renderedCallback(){
        console.log("Rendering Feature ");
        if(this.isDataLoaded) return;
        hoteldetail().then(result => {
            this.getHotels = result;
            
            this.hasRenderd = true;
            console.log("Data from back", result);

            
        })
        .catch(error => {
            console.error('Error fetching test4 names:', error);
        });

        this.isDataLoaded = true;

    }
     
}