import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class ResAboutUs extends NavigationMixin(LightningElement) {
    handleContactUs(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://respira-dev.my.site.com/respira/s/contact-us`,
                target: '_self'
            }
        });
    }

}