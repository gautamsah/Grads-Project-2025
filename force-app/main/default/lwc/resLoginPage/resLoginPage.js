import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import poolPhoto from '@salesforce/resourceUrl/HotelLogin';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import login from '@salesforce/apex/LoginControllerCustom.login';
import getIsSelfRegistrationEnabled from '@salesforce/apex/LoginControllerCustom.getIsSelfRegistrationEnabled';
import getSelfRegistrationUrl from '@salesforce/apex/LoginControllerCustom.getSelfRegistrationUrl';
import getForgotPasswordUrl from '@salesforce/apex/LoginControllerCustom.getForgotPasswordUrl';
// import login from '@salesforce/apex/RESLoginController.login';
// import forgotpassword from '@salesforce/apex/RESLoginController.forgotPassword';

export default class ResLoginPage extends NavigationMixin(LightningElement) {
    hotelPool = poolPhoto;
    // forgotpassword = 'hide-input';
    // login = 'show-input';

//     userDetails = {
//         username:'',
//         password: ''
//     };
//     errorMessageCssClass = 'hide-error';

//     showToast(variant, title, message) {
//         const event = new ShowToastEvent({
//             title: title,
//             message: message,
//             variant: variant,
//         });
//         this.dispatchEvent(event);
//     }

//     handleChange(event) {
//         let { fieldName, fieldValue } = event.detail;
//         this.userDetails = { ...this.userDetails, [fieldName]: fieldValue };
        
//     }
//     startUrl;
//     onSignUpClick() {

//         console.log(this.userDetails.username);
//         console.log(this.userDetails.password);
        
//         if (Object.entries(this.userDetails).some(([, value]) => !value)) {
//             this.className = 'show-error';
//             throw new Error('Please fill all the details');
//         } else {
//         this.className = 'hide-error';
//         // this.startUrl = '/s/';

        
//         // login({ username: this.userDetails.username, password: this.userDetails.password, startUrl: this.startUrl})
//         //     .then(result => {
//         //         console.log('User Login Successfully');
//         //         this.showToast('success', 'User Successfuly Log In', 'User Successfuly Log In');
//         //         const redirectUrl = result;
//         //         window.location.href = redirectUrl;
//         //     })
//         //     .catch(error => {
//         //         this.errorMessage = error.body.message || 'An unknown error occurred during login';
//         //         this.showToast('error', 'Wrong Crendentials', 'Please Enter Valid Crendentials');
//         //     });  
//         // }


//     }

//     // onForgotPasswordClick(){
       
//     //     this.forgotpassword = 'show-input';
//     //     this.login = 'hide-input';
            
//     // }
//     // backtologin(){
//     //     this.forgotpassword = 'hide-input';
//     //     this.login = 'show-input';
//     // }
//     // onForgotPassword(event){
//     //     console.log('Password Reset');
//     //     forgotpassword({username:this.userDetails.username})
//     //     .then(result =>{
//     //         console.log('Password Reset Successfully');
//     //         this.showToast('success', 'Password Reset Successfully', 'Password Reset Successfully');
//     //     }).catch(error =>{
//     //         this.errorMessage = error.body.message || 'An unknown error occurred during login';});
//     // }

//   }

    
    userDetails = {
        username:'',
        password: ''
    };
    errorMessage = '';
    forgotPasswordUrl = '';
    selfRegistrationUrl = '';

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
    connectedCallback() {
        console.log('[LWC] Component initialized');
        this.fetchAuthConfig();
    }

    async fetchAuthConfig() {
        try {
            console.log('[LWC] Fetching authentication config...');
            
            const isSelfRegEnabled = await getIsSelfRegistrationEnabled();
            this.selfRegistrationUrl = isSelfRegEnabled ? await getSelfRegistrationUrl() : '';

            this.forgotPasswordUrl = await getForgotPasswordUrl() || '';

            console.log('[LWC] Self-registration enabled:', isSelfRegEnabled);
            console.log('[LWC] Self-registration URL:', this.selfRegistrationUrl);
            console.log('[LWC] Forgot password URL:', this.forgotPasswordUrl);
        } catch (error) {
            console.error('[LWC] Error fetching authentication config:', error);
        }
    }

    // handleUsernameChange(event) {
    //     this.userDetails.username = event.target.value.trim();
    //     console.log('[LWC] Username updated:', this.userDetails.username);
    // }

    // handlePasswordChange(event) {
    //     this.userDetails.password = event.target.value.trim();
    //     console.log('[LWC] Password updated: ********'); // Masking password for security
    // }

    async handleLogin() {

        console.log(this.userDetails.username);
        console.log(this.userDetails.password);
        // console.log('[LWC] Login button clicked');

        // if (!this.userDetails.username || !this.userDetails.password) {
        //     this.errorMessage = 'Username and password are required!';
        //     console.warn('[LWC] Missing username or password');
        //     return;
        // }

        if (Object.entries(this.userDetails).some(([, value]) => !value)) {
                        this.className = 'show-error';
                        throw new Error('Please fill all the details');
                    } else {
                    this.className = 'hide-error';
                    }
        // console.log('[LWC] Attempting login with:', this.userDetails.username);

        try {
            const result = await login({ username: this.userDetails.username, password: this.userDetails.password, startUrl: 'https://respira-dev.my.site.com/respira'});
            console.log('[LWC] Login result:', result);

            if (result && result.startsWith('https')) {
                console.log('[LWC] Redirecting to:', result);
                this.showToast('success', 'User Successfuly Log In', 'User Successfuly Log In');
                window.location.replace(result);
            } else {
                this.errorMessage = result || 'Login failed. Please try again.';
                this.showToast('error', 'Wrong Crendentials', 'Please Enter Valid Crendentials');
                console.error('[LWC] Login error:', this.errorMessage);
            }
        } catch (error) {
            console.error('[LWC] Login failed:', error);
            this.showToast('error', 'Wrong Crendentials', 'Please Enter Valid Crendentials');
            this.errorMessage = 'Login failed. Please try again.';
        }
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
