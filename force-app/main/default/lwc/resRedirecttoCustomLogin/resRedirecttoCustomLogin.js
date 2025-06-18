import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class ResRedirecttoCustomLogin extends NavigationMixin(LightningElement) {
    
    connectedCallback() {
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
               url: 'https://respira-dev.my.site.com/respira/s/loginpage',
               target:'_self'
            }
         });
    }
}