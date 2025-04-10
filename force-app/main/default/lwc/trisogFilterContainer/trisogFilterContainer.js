import { MessageContext, publish } from 'lightning/messageService';
import { LightningElement, wire } from 'lwc';
import PRICE_FILTER_COMMUNICATION_CHANNEL from '@salesforce/messageChannel/PriceFilterCommunicationChannel__c';

export default class TrisogFilterContainer extends LightningElement {
    rangeValue = 550;

    @wire(MessageContext)
    messageContext;

    handleRangeChange(event){
        this.rangeValue = event.target.value;
    }

    handleFilterButton(){
        const msgInput = this.rangeValue;
        const payload = {message : msgInput};
        publish(this.messageContext, PRICE_FILTER_COMMUNICATION_CHANNEL, payload);
        console.log('payload' , payload.message);
        console.log('message context', this.messageContext);
        console.log('price filter communication channel',this.PRICE_FILTER_COMMUNICATION_CHANNEL);

    }


}