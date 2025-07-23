import { LightningElement, track } from 'lwc';
import getOfferItems from '@salesforce/apex/RESHomePageCarouselController.getOfferItems';
/*
@Class name : ResHomePageCarousel
@description : Home Page Carousel to show the Offers in the swiper
@Author: Milin Kapatel
@Date: 26/03/2025
@JIRA: GT25-6
Revision Log  :   
Ver   Date         Author                               Modification
1.0   26-03-2025   Milin Kapatel                      Initial Version
2.0   02-04-2025   Milin Kapatel                      Added Comments
*/
export default class ResHomePageCarousel extends LightningElement {


  @track offerItems = [];
  /*
  *********************************************************
  @methodName     : connectedCallback
  @author         : Milin Kapatel
  @description    : method to is used for getting the Offers Records from apex and assigning it to the local variable
  @param          : void
  @return         : void
  @date			: March 26, 2025
  @JIRA			: GT25-6
  ********************************************************
  */
  

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