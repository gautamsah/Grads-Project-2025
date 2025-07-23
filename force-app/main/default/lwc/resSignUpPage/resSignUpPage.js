import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createSiteUser from '@salesforce/apex/RESSignUpController.createSiteUser';
export default class ResSignUpPage extends NavigationMixin(LightningElement) {
    @track showModal = false;
    userDetails = {
        
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        agreement: false,
    };

    field;
    count = 0;
    haveError = false;
    backgroundImage = "https://raw.githubusercontent.com/pritprajapati/Trisog-images/refs/heads/main/big-ben.jpg";

    errorMessageCssClass = 'hide-error';

    showToast(variant, title, message) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    handleChange(event) {
        let { fieldName, fieldValue } = event.detail;
        this.userDetails = { ...this.userDetails, [fieldName]: fieldValue };
    }

    onSignUpClick() {
        this.template.querySelectorAll('c-res-input').forEach((c) => {
            this.haveError = c.validationCheck();
            if (this.haveError) {
                this.count = this.count + 1;
            }
            console.log(this.count);
        });
        if (this.count == 0) {
            let hasError = false;
            if (!this.userDetails.agreement) {
                hasError = true;
                this.errorMessageCssClass = 'show-error';
            } else {
                this.errorMessageCssClass = 'hide-error';
            }
            if (hasError) {
                return;
            } else {
                this.errorMessageCssClass = 'hide-error';
                createSiteUser({
                    firstName: this.userDetails.firstName, lastName: this.userDetails.lastName, email: this.userDetails.email, phone: this.userDetails.phone
                }).then(() => {

                    this.showToast('success', 'User Creation Successful', 'The user has been created!');
                    Object.entries(this.userDetails).some(([, value]) => value = undefined);
                    this.showModal = true;
                    setTimeout(() => {
                        this[NavigationMixin.Navigate]({
                            type: 'standard__webPage',
                            attributes: {
                                url: 'https://respira-dev.my.site.com/respira/s/loginpage'
                            }
                        });
                    }, 8000);
                    
                }).catch(error => {
                    this.showToast('error', 'User Creation Failed ', JSON.stringify(error.body.message));
                })
            }
        }
        else {
            this.count = 0;
        }

    }

    handleLoginClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://respira-dev.my.site.com/respira/s/loginpage'
            }
        });
    }
}