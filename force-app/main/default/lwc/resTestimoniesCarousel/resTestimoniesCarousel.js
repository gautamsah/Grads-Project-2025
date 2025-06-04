import { LightningElement, track } from 'lwc';
import getQuoteItems from '@salesforce/apex/RESHomePageCarouselController.getQuoteItems';

export default class ResTestimoniesCarousel extends LightningElement {
    @track quoteItems = [];

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