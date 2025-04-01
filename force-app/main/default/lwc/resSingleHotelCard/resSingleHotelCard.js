import { LightningElement,api } from 'lwc';
import myResource from '@salesforce/resourceUrl/respiraLogo';
import { NavigationMixin } from 'lightning/navigation';


export default class ResHotelCardChild extends NavigationMixin(LightningElement) {

    @api
    rating = 4.8;

    @api
    price = 120;

    @api
    hotelName = "Serenity Villa";

    @api
    imgName = myResource;

    @api
    city = "Ubud";

    @api
    state = "Bali";


    gotodetailpage(){
              this[NavigationMixin.Navigate]({
                         type: 'standard__webPage',
                         attributes: {
                             url: 'https://respira-dev.my.site.com/respira/s/hoteldetailpage',
                             target:'_self'
                         }
                     });
         }
}