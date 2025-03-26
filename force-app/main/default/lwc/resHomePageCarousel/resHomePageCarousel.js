import { LightningElement, track } from 'lwc';
import getOfferItems from '@salesforce/apex/RESHomePageCarouselController.getOfferItems';

export default class ResHomePageCarousel extends LightningElement {


  @track offerItems = [];
  

  async connectedCallback(){
    
    try{
      await getOfferItems().then(offerResult => {
        this.offerItems = offerResult;
      });
    }
    catch(error){
      console.log(error);
    }

    
  }


}