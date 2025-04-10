import { LightningElement, track } from 'lwc';
import getQuoteItems from '@salesforce/apex/RESHomePageCarouselController.getQuoteItems';
/*
@Class name : ResTestimoniesCarousel
@description : Testimonial Carousel to show the testimonials in the swiper
@Author: Milin Kapatel
@Date: 26/03/2025
@JIRA: GT25-6
Revision Log  :   
Ver   Date         Author                               Modification
1.0   26-03-2025   Milin Kapatel                      Initial Version
2.0   02-04-2025   Milin Kapatel                      Added Comments
*/
export default class ResTestimoniesCarousel extends LightningElement {
    @track quoteItems = [];
    /*
    *********************************************************
    @methodName     : connectedCallback
    @author         : Milin Kapatel
    @description    : method to is used for getting the Testimonials Records from apex and assigning it to the local variable
    @param          : void
    @return         : void
    @date			: March 26, 2025
    @JIRA			: GT25-6
    ********************************************************
    */
    async connectedCallback(){
        
        try{
          await getQuoteItems().then(quoteResult => {
            this.quoteItems = quoteResult;
          });
        }
        catch(error){
          console.log(error);
        }
    
      }
}