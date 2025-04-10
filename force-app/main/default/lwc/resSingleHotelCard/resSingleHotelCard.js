import { LightningElement,api } from 'lwc';
import myResource from '@salesforce/resourceUrl/respiraLogo';
import { NavigationMixin } from 'lightning/navigation';


export default class ResHotelCardChild extends NavigationMixin(LightningElement) {

      @api
      bookBtn = false;

       @api
       hotelUniqueName;

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

       get bookBtnCss(){
         console.log('Hotel Name => '+this.hotelName);
         console.log('Hotel Name => '+this.bookBtn);
         if(this.bookBtn == true){
            return 'card-btn';
         }
         else{
            return 'card-btn card-btn-disable';
         }
       }

      gotodetailpage(){
         this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
               url: `https://respira-dev.my.site.com/respira/s/hotel?hotelUniqueName=${this.hotelUniqueName}`,
               target:'_self'
            }
         });
      }

      gotoBookingPage(){
         this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
               url: `https://respira-dev.my.site.com/respira/s/room?hotelUniqueName=${this.hotelUniqueName}`,
               target:'_self'
            }
         });
      }
}