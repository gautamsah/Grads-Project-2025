import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import poolPhoto from '@salesforce/resourceUrl/HotelLogin';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import login from '@salesforce/apex/RESLoginController.login';
import forgotpassword from '@salesforce/apex/RESLoginController.forgotPassword';

export default class ResLoginPage extends NavigationMixin(LightningElement) {
    hotelPool = poolPhoto;
    forgotpassword = 'hide-input';
    login = 'show-input';

    userDetails = {
        username:'',
        password: ''
    };
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
    startUrl;
    onSignUpClick() {

        console.log(this.userDetails.username);
        console.log(this.userDetails.password);
        
        if (Object.entries(this.userDetails).some(([, value]) => !value)) {
            this.className = 'show-error';
            throw new Error('Please fill all the details');
        } else {
        this.className = 'hide-error';
        this.startUrl = '/s/';

        
        login({ username: this.userDetails.username, password: this.userDetails.password, startUrl: this.startUrl})
            .then(result => {
                console.log('User Login Successfully');
                this.showToast('success', 'User Successfuly Log In', 'User Successfuly Log In');
                const redirectUrl = result;
                window.location.href = redirectUrl;
            })
            .catch(error => {
                this.errorMessage = error.body.message || 'An unknown error occurred during login';
                this.showToast('error', 'Wrong Crendentials', 'Please Enter Valid Crendentials');
            });  
        }
    }

    onForgotPasswordClick(){
       
        this.forgotpassword = 'show-input';
        this.login = 'hide-input';
            
    }
    backtologin(){
        this.forgotpassword = 'hide-input';
        this.login = 'show-input';
    }
    onForgotPassword(event){
        console.log('Password Reset');
        forgotpassword({username:this.userDetails.username})
        .then(result =>{
            console.log('Password Reset Successfully');
            this.showToast('success', 'Password Reset Successfully', 'Password Reset Successfully');
        }).catch(error =>{
            this.errorMessage = error.body.message || 'An unknown error occurred during login';});
    }

    handleLoginClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://respira-dev.my.site.com/respira/s/signup'
            }
        });
    }
}
