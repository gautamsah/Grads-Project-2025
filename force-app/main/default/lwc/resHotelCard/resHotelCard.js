import { LightningElement } from 'lwc';
// import { NavigationMixin } from 'lightning/navigation';
import hoteldetail from '@salesforce/apex/RES_Utility.getRatingHotelCards';

export default class ResHotelCard extends LightningElement{
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

    // gotodetailpage(){
    //      this[NavigationMixin.Navigate]({
    //                 type: 'standard__webPage',
    //                 attributes: {
    //                     url: 'https://respira-dev.my.site.com/respira/s/hoteldetailpage',
    //                     target:'_self'
    //                 }
    //             });
    // }

        
}