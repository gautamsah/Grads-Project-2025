import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class ResCareer extends NavigationMixin(LightningElement) {
    handleGetInTouch(){
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `https://respira-dev.my.site.com/respira/s/contact-us`,
                target: '_self'
            }
        });
    }

}