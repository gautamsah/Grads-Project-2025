import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProfileDetails  from '@salesforce/apex/RESProfileController.getProfileDetails';

export default class ResContactUsPage extends LightningElement {

    email = '';
    name = '';
    connectedCallback(){
            getProfileDetails().then(result =>{
                console.log(result.accRecord);
                this.email =  result.accRecord.PersonEmail;
                this.name = result.accRecord.LastName;
            }).catch(error =>{
                console.log(JSON.stringify(error.message));
            }); 
    }
    showToast(variant, title, message) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    handleSubmit(){
        this.showToast('success', 'Submitted Successfuly', 'Your Case Submitted Successfuly');
    }
}