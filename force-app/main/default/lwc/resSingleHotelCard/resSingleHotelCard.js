import { LightningElement,api, track } from 'lwc';
import myResource from '@salesforce/resourceUrl/respiraLogo';
import { NavigationMixin } from 'lightning/navigation';
import userId from '@salesforce/user/Id';

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

       @track buttonLabel = 'Book Now';

       get bookBtnCss(){
         console.log('Hotel Name => '+this.hotelName);
         console.log('Hotel Name => '+this.bookBtn);
         if(this.bookBtn == true){
            this.buttonLabel = 'Book Now';
            return 'card-btn';
         }
         else{
            this.buttonLabel = 'Sold Out';
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

         if (!userId) {
            //navigation mixin to login page + session management
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: `https://respira-dev.my.site.com/respira/s/loginpage`,
                    target: '_self',
                }
            });
            return;
        }
         this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
               url: `https://respira-dev.my.site.com/respira/s/room?hotelUniqueName=${this.hotelUniqueName}`,
               target:'_self'
            }
         });
      }
}