import getTours from '@salesforce/apex/TourController.getTours';
import { MessageContext, subscribe } from 'lightning/messageService';
import { LightningElement, wire } from 'lwc';
import PRICE_FILTER_COMMUNICATION_CHANNEL from '@salesforce/messageChannel/PriceFilterCommunicationChannel__c';

export default class TrisogCardContainer extends LightningElement {
    tours;
    filterTours;
    filterPrice;
    subscription = null;
    @wire(getTours)
    wiredTours({error,data}){
        if(error){
            this.tours = undefined;
            this.filterTours = this.tours;
        }
        else if(data){
            this.tours = data;
            this.filterTours = this.tours;
        }
    }

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        console.log('price filter comm.. ' ,this.PRICE_FILTER_COMMUNICATION_CHANNEL);
        
        if (!this.subscription) {
            this.subscription = subscribe(this.messageContext, PRICE_FILTER_COMMUNICATION_CHANNEL, (pay) => this.handlePriceFilter(pay));
        }

    }

    handlePriceFilter(pay){
        console.log(pay);
        
        this.filterTours = this.tours.filter(tour => {
            return tour.Price__c > pay.message;
        } 
        )
    }


    
}